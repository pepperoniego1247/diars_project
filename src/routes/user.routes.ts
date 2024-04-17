import { Router, Request, Response } from "express";
import * as dotenv from "dotenv";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { User } from "../entities/user";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { IUser } from "../interfaces/user";
import { ActiveSession } from "../entities/activeSession";

const router = Router();
dotenv.config();

router.post("/user/login/", 
    checkSchema({
        email: {
            in: ["body"],
            isEmail: true,
            notEmpty: true,
            errorMessage: "email invalido, evita los espacios vacios o emails incorrectos."
        },
        password: {
            in: ["body"],
            isLength: {
                options: { max: 30, min: 8 },
                errorMessage: "max: 30 | min: 8 caracteres validos, contraseña incorrecta!"
            },
            isAlphanumeric: { errorMessage: "la constraseña solo debe contener letras y numeros"}
        },
        device: {
            in: ["body"],
            notEmpty: { errorMessage: "el dispositivo no puede tener campos vacios!" }
        }
    }),
    validateReq,
    async (req: Request, res: Response) => {
        const userToAuth = await appDataSource.getRepository(User).findOne({ where: { email: req.body["email"] } });
        if (!userToAuth) return res.status(401).send("el correo no existe!");
        if (!await bcrypt.compare(req.body["password"], userToAuth["password"])) return res.status(401).send("contraseña erronea!");

        const accessToken = await jwt.sign({
            email: userToAuth["email"],
            id: userToAuth["id"]
        }, process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "1hr"
        });

        const verifySession = await appDataSource.getRepository(ActiveSession).findOne({ where: { userId: userToAuth } });
        if (verifySession) return res.status(403).json({ message: "el usuario ya esta logueado!" }); 

        const decodedToken: jwt.JwtPayload = jwt.decode(accessToken, { json: true })!;
        const creationDate: Date = new Date(decodedToken.iat! * 1000);
        const expirationDate: Date = new Date(decodedToken.exp! * 1000);
        const activeSession: any = {
            userId: userToAuth,
            device: req.body["device"],
            creationDate: creationDate,
            expirationDate: expirationDate,
            jwt: accessToken
        }

        await appDataSource.getRepository(ActiveSession).save(activeSession);

        return res.send({
            message: "logeo existoso!",
            jwt: accessToken,
            id: userToAuth.id,
        });
    });

router.post("/user/register/", 
    checkSchema({
        email: {
            in: ["body"],
            isEmail: true, 
            notEmpty: true,
            errorMessage: "email invalido!!",
        },
        password: {
            in: ["body"],
            isLength: {
                options: { max: 30, min: 8 },
                errorMessage: "max: 30 | min: 8 caracteres! contraseña invalida"
            },
            isAlphanumeric: { errorMessage: "la contraseña debe contener solo letras y numeros!" }
        },
        type: {
            in: ["body"],
            isAlpha: { errorMessage: "tiene que ser un texto" }
        }
    }),
    validateReq,
    async (req: Request, res: Response) => {
        try {
            const userAlreadyExists = await appDataSource.getRepository("user").findOne({ where: { email: req.body["email"] } });
            if (userAlreadyExists) return res.status(500).json({ message: "el usuario ya existe!" }); 
            
            const { ...user } = req.body;
            const newUser: IUser = <IUser>(<unknown> { ...user })
            
            newUser["password"] = await bcrypt.hash(newUser["password"], 8);
            const data = await appDataSource.getRepository("user").save(newUser);
            
            return res.json(data);
        } catch (error) { return res.status(500).json({ message: error }); } 
    });


router.get("/user/get_all/", 
    async (_: Request, res: Response) => {
        try {
            const allUsers = await appDataSource.getRepository(User).find({ relations: ["employee"] });
            if (!allUsers) return res.status(403).send({ message: "error al encontrar los usuarios!" })
            return res.send(allUsers);
        } catch (error) {
            return res.status(403).json({ message: error });
        }
    }
)

router.get("/user/get_by_id/:id", 
    param("id")
        .isNumeric({ no_symbols: true })
        .withMessage("el id debe ser entero!"),
    validateReq,
    async (req: Request, res: Response) => {
        try {
            const userById = await appDataSource.getRepository("user").findOne({ where: { id: req.params["id"] } });
            if (!userById) return res.status(403).send({ message: "el usuario no existe!" });      
            
            return res.send({
                message: "usuario encontrado!",
                user: userById
            });
        } catch (error) {
            return res.status(500).send({ 
                message: "error en el servidor!",
                error: error
            });
        }
    }
)

router.put("/user/edit_by_id/:id",
    checkSchema({
        type: {
            in: ["body"],
            optional: true,
            isAlpha: { errorMessage: "solo puede tener caracteres" },
            errorMessage: "ha ocurrido un error en el campo type!"
        },
        password: {
            in: ["body"],
            optional: true,
            isLength: {
                options: { max: 30, min: 8 },
                errorMessage: "max: 30 | min: 8 caracteres validos, contraseña incorrecta!"
            },
            isAlphanumeric: { errorMessage: "la constraseña solo debe contener letras y numeros"}
        }
    }),
    param("id")
        .isNumeric({ no_symbols: true })
        .withMessage("el id debe ser numerico!"),
    validateReq,
    async (req: Request, res: Response) => {
        try {
            const userToEdit = await appDataSource.getRepository("user").findOne({ where: { id: req.params["id"] } });
            if (!userToEdit) return res.status(403).send({ message: "el usuario no existe!" });

            (req.body["password"]) ? userToEdit["password"] = await bcrypt.hash(req.body["password"], 8) : userToEdit["type"] = req.body["type"];
            await appDataSource.getRepository("user").save(userToEdit);

            return res.send({ 
                message: "el usuario se ha actualizado!"
            });
        } catch (error) {
            return res.status(500).send({ message: "error en el servidor!" });
        }
    }
);
export default router;
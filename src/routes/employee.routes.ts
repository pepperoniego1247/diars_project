import { Router, Request, Response } from "express";
import { checkSchema, param } from "express-validator";
import { validateReq } from "../middlewares/validateRequest";
import { appDataSource } from "../dataBase";
import { ICreateEmployee } from "../interfaces/employee";
import { ICreatePerson } from "../interfaces/person";

const router = Router();

router.post("/employee/register/", 
    checkSchema({
        dni: {
            in: ["body"],
            isNumeric: { errorMessage: "el dni debe ser numerico" },
            notEmpty: true,
            errorMessage: "el campo dni no puede estar vacio"
        },
        firstName: {
            in: ["body"],
            isAlpha: true,
            notEmpty: true,
            errorMessage: "informacion invalida en el campo de los nombres"
        },
        lastName: {
            in: ["body"],
            isAlpha: true,
            notEmpty: true,
            errorMessage: "informacion invalida en el campo de los apellidos"
        },
        phoneNumber: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "datos del numero celular erroneos"
        },
        role: {
            in: ["body"],
            isAlpha: true,
            notEmpty: true,
            custom: {
                options: (value: string) => value === "administrador" || value === "cajero" || value === "estilista" || value === "cosmetologo"
            },
            errorMessage: "se ha ingresado un rol no valido"
        },
        activo: {
            in: ["body"],
            custom: {
                options: (value: boolean) => value === true
            },
            errorMessage: "el estado deber ser un booleano",
        }
    }), 
    validateReq,
    async (req: Request, res: Response) => {
        const personAlreadyExists = await appDataSource.getRepository("person").findOne({ where: { dni: req.body["body"] } });
        if (personAlreadyExists) return res.status(403).send({ message: "esta persona ya esta registrada" });

        const { ...person } = req.body;
        const newPerson: ICreatePerson = <ICreatePerson>(<unknown> { ...person });
        const employeePerson = await appDataSource.getRepository("person").save(newPerson);
        const asignedRole = await appDataSource.getRepository("role").findOne({ where: { name: req.body["role"] } });

        const { ...employee } = { 
            role: asignedRole,
            person: employeePerson
        }

        const newEmployee: ICreateEmployee = <ICreateEmployee>(<unknown> { ...employee } );
        const data = await appDataSource.getRepository("employee").save(newEmployee);

        return res.send({
            message: "se ha creado con exito el empleado!",
            data: data
        });
    }
);

router.get("/employee/get_all/", 
    async (_: Request, res: Response) => {
        try {
            const data = await appDataSource.getRepository("employee").find({ relations: ["role", "person"] });
            return res.send({
                data: data
            });
        } catch (error) {
            return res.status(500).send({
                message: error
            });
        }
    }
);

router.get("/employee/get_by_id/:id", 
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("verifique el id pasado como parametro"),
    validateReq,
    async (req: Request, res: Response) => {
        try {
            const employeeExists = await appDataSource.getRepository("employee").findOne({ where: { id: req.params["id"] }, relations: ["role", "person"] });
            if (!employeeExists) return res.status(403).send({ message: "el empleado no existe" });
        
            return res.send({
                employee: employeeExists
            });
        } catch (error) {
            return res.status(500).send({ message: "ha ocurrido un error en la base de datos" });
        }
    }
);

router.put("/employee/update_employee_by_id/:id",
    checkSchema({
        dni: {
            in: ["body"],
            isNumeric: { errorMessage: "el dni debe ser numerico" },
            notEmpty: true,
            errorMessage: "el campo dni no puede estar vacio"
        },
        firstName: {
            in: ["body"],
            isAlpha: true,
            notEmpty: true,
            errorMessage: "informacion invalida en el campo de los nombres"
        },
        lastName: {
            in: ["body"],
            isAlpha: true,
            notEmpty: true,
            errorMessage: "informacion invalida en el campo de los apellidos"
        },
        phoneNumber: {
            in: ["body"],
            isNumeric: true,
            notEmpty: true,
            errorMessage: "datos del numero celular erroneos"
        },
        role: {
            in: ["body"],
            isAlpha: true,
            notEmpty: true,
            custom: {
                options: (value: string) => value === "administrador" || value === "cajero" || value === "estilista" || value === "cosmetologo"
            },
            errorMessage: "se ha ingresado un rol no valido"
        },
        activo: {
            in: ["body"],
            custom: {
                options: (value: boolean) => value === true || value === false
            },
            errorMessage: "el estado deber ser un booleano",
        }
    }),
    param("id")
        .isNumeric({ no_symbols: true })
        .notEmpty()
        .withMessage("verifique el id pasado como parametro"),
    validateReq,
    async (req: Request, res: Response) => {
        const employeeExists = await appDataSource.getRepository("employee").findOne({ where: { id: req.params["id"] }, relations: ["role", "person"] });
        if (!employeeExists) return res.status(403).send({ message: "el empleado no existe" });

        const newRole = await appDataSource.getRepository("role").findOne({ where: { name: req.body["role"] } });
        delete req.body["role"];

        await appDataSource.getRepository("employee").update({ id: req.params["id"] }, { role: newRole });
        await appDataSource.getRepository("person").update({ id: employeeExists["person"]["id"] }, { ...req.body });
        
        return res.send({ message: "el empleado se ha actualizado!" });
    }
);

export default router;
import { pool } from "../libs/db";
import { json } from "express";

const token = {
    getall: async () => {
        try {
            const result = await pool.query(`SELECT * FROM premio_disponible`);
            return result;
        } catch (err) {
            return err;
        }
    },
}
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Database } from "./config/database";
import apiRoutes from "./routes/api";

dotenv.config();

class Server {
  private app: Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.init();
  }

  private async init(): Promise<void> {
    await Database.connect();
    this.middlewares();
    this.routes();

    this.errorHandling();
    this.listen();
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use("/api", apiRoutes);
  }

  private errorHandling(): void {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(
          "❌ [Error detectado en el servidor]:",
          err.message || err,
        );

        if (err.name === "ValidationError") {
          const errorMessages = Object.values(err.errors).map(
            (element: any) => element.message,
          );
          res.status(400).json({
            status: "Error",
            message: "Los datos enviados no cumplen con las reglas del modelo.",
            errors: errorMessages,
          });
          return;
        }

        if (err.name === "CastError") {
          res.status(400).json({
            status: "Error",
            message: `El valor asignado a la propiedad [${err.path}] es inválido o tiene un formato incorrecto.`,
          });
          return;
        }

        if (err.code === 11000) {
          const field = Object.keys(err.keyValue || {});
          res.status(400).json({
            status: "Error",
            message: `El registro para el campo [${field}] ya existe y debe ser único.`,
          });
          return;
        }

        res.status(500).json({
          status: "Fatal",
          message: "Ocurrió un error interno en el servidor local.",
          error: err.message || err,
        });
      },
    );
  }
  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(
        `🚀 [Server] Servidor corriendo localmente en: http://localhost:${this.port}`,
      );
    });
  }
}
new Server();

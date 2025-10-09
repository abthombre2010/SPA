import { ServiceKey } from "@microsoft/sp-core-library";
import ILoggerService from "./ILoggerService";
import ICustomLogMessage from "../models/ICustomLogMessage";
import  spservices  from "../services/spService";
import { ListTitles } from "../shared/helpers/constant";
import  Helper  from "../shared/helpers/index";

/* The LoggingService class provides methods for logging verbose, information, warning, and error
messages with optional service scope. */
export class LoggingService implements ILoggerService {
  public static readonly serviceKey: ServiceKey<ILoggerService> =
    ServiceKey.create<ILoggerService>("ECO.LoggingService", LoggingService);

    private spService: spservices;

  constructor(context:any) {
    this.spService=new spservices(context);
  }
  public Log = async (logMessage: ICustomLogMessage) => {
    try {
      await this.saveLogs(logMessage, "Log");
    } catch (error) {
      //Can't do anything
      console.error(error.Message);
    }
  };

  public Warn = async (logMessage: ICustomLogMessage) => {
    try {
      await this.saveLogs(logMessage, "Warn");
    } catch (error) {
      //Can't do anything
      console.error(error.Message);
    }
  };

  public Verbose = async (logMessage: ICustomLogMessage) => {
    try {
      await this.saveLogs(logMessage, "Verbose");
    } catch (error) {
      //Can't do anything
      console.error(error.Message);
    }
  };

  public Error = async (logMessage: ICustomLogMessage) => {
    try {
      console.error(logMessage.Message);
      await this.saveLogs(logMessage, "Error");
    } catch (error) {
      //Can't do anything
      console.error(error.Message);
    }
  };

  private saveLogs = async (logMessage: ICustomLogMessage, logType: string) => {
    try {
      const webpartLoggingData = {
        WebPartName: logMessage.WebPartName,
        ComponentName: logMessage.ComponentName,
        MethodName: logMessage.MethodName,
        Message: logMessage.Message,
        LogType: logType,
        Date: Helper.currentDate(),
      };
      await this.spService.saveListItem(ListTitles.ExceptionLogs, webpartLoggingData);
    } catch (error) {
      console.error("An error occurred while saving logs:", error);
    }
  };
}

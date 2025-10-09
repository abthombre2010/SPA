import ICustomLogMessage from '../models/ICustomLogMessage';
 
/* The `interface ILoggerService` defines a contract for a logger service in TypeScript. It specifies
four methods: `Log`, `Warn`, `Verbose`, and `Error`, each of which takes a parameter of type
`ICustomLogMessage` and returns `void`. This interface can be implemented by a class or object to
provide logging functionality. */
interface ILoggerService {
    Log(logMessage: ICustomLogMessage): void;
    Warn(logMessage: ICustomLogMessage): void;
    Verbose(logMessage: ICustomLogMessage): void;
    Error(logMessage: ICustomLogMessage): void;
}
 
export default ILoggerService;
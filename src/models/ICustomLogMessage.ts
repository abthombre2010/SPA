/* This is defining an interface named `ICustomLogMessage` which has four properties: `WebPartName`,
`ComponentName`, `MethodName`, and `Message`, all of which are of type `string`. This interface can
be used to define the shape of objects that conform to this structure. The `export default`
statement at the end is exporting this interface so that it can be imported and used in other
modules. */
interface ICustomLogMessage {
    WebPartName: string,
    ComponentName: string,
    MethodName: string,
    Message: string
}
 
export default ICustomLogMessage;
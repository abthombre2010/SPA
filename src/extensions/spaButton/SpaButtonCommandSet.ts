import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { SPComponentLoader } from '@microsoft/sp-loader';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpaButtonCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'SpaButtonCommandSet';

export default class SpaButtonCommandSet extends BaseListViewCommandSet<ISpaButtonCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized SpaButtonCommandSet');

    // initial state of the command's visibility
   const compareOneCommand: Command = this.tryGetCommand('COMMAND_CustomNew');
    if(this.context.pageContext.list?.title.toLowerCase().indexOf('procurement approvals') !=-1){
      SPComponentLoader.loadCss('../../shared/styles/hideButton.css');
      compareOneCommand.visible = true; 
    }else{
      compareOneCommand.visible = false; 
    }
    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_CustomNew':
       window.location.href=  this.context.pageContext.web.absoluteUrl+"/SitePages/NewSPAForm.aspx";
      break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

   const compareOneCommand: Command = this.tryGetCommand('COMMAND_CustomNew');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible =true;
    }

    // TODO: Add your logic here

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }
}

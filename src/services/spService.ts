import { spfi, SPFI,SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/views";
import "@pnp/sp/fields";
import "@pnp/sp/security";
import "@pnp/sp/attachments";
import "@pnp/sp/folders";

import { PermissionKind } from "@pnp/sp/security";
import "@pnp/sp/site-users/web";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export default class spservices {
  
  private sp: SPFI;
  private spHttpClient: SPHttpClient;

  constructor(private context: any) {
      // Setuo Context to PnPjs and MSGraph
      this.sp = spfi().using(SPFx(this.context));
        
      this.spHttpClient = this.context.spHttpClient;
  }

  public async getListItem(listId:any,viewFields:any,expandFields:any,filter:any,orderBy?:any,orderByOrder?:any,top?:any){
    try{
        let event = await this.sp.web.lists.getByTitle(listId).items
        .select(viewFields)
        .expand(expandFields)
        .orderBy(orderBy?orderBy:"Id",orderByOrder?orderByOrder:false)
        .filter(filter)
        .top(top?top:5000)();

        return event;
    }catch(err){
        console.error(err);
          return [];
    }
  }

  public async getChoiceColumnsAndValues(listName: string) {
    try {
      let dropdownColumns:any={};
      // Get all fields from the list
      const fields = await this.sp.web.lists.getByTitle(listName).fields();

      // Filter fields to get only "Choice" type columns
      const choiceFields = fields.filter(field => field.FieldTypeKind === 6);  

      // Log the choice columns and their values
      choiceFields.forEach((field:any) => {
        let options:any=[];
        field.Choices.forEach((element:any) => {
          options.push({value:element,label:element}); 
        });
        dropdownColumns[field.Title]=options;
      });
      return dropdownColumns;

    } catch (error) {
      console.error("Error fetching choice columns:", error);
    }
  }

  public async getListItemWithPagination(listId:any,viewFields:any,expandFields:any,filter:any,PID:any){
    try{
      let event = await this.sp.web.lists.getByTitle(listId).items
      .select(viewFields)
      .expand(expandFields)
      .orderBy("Id",true)
      .filter(filter)
      .skip(4)
      .top(4)
      ();
        

        return event;
    }catch(err){
          return [];
    }
  }

  public async getListDetails(listId:any){
    try{
        let event = await this.sp.web.lists.getById(listId)();
        return event;
    }catch(err){
          return [];
    }
  }

  public async getCurrentUserGroups(){
    try{
        let event = await this.sp.web.currentUser.groups();
        return event;
    }catch(err){
          return [];
    }
  }

  public async checkFolderExists(url:any){
    try{
        let folder = await this.sp.web.getFolderByServerRelativePath(url).select("Exists")();
        if (folder.Exists) return true; else return false;
    }catch(err){
        return false;
    }
  }

  public async getFolderItem(listId:any,query:any){
    const results = await this.sp.web.lists.getByTitle(listId).renderListDataAsStream(
      { 
        DatesInUtc: true,
        ViewXml: `<View Scope='RecursiveAll'><ViewFields><FieldRef Name='Id'/><FieldRef Name='Title'/><FieldRef Name='Editor'/><FieldRef Name='Created'/><FieldRef Name='FileLeafRef'/><FieldRef Name='File_x0020_Type'/><FieldRef Name='CheckoutUserId'/><FieldRef Name='CheckedOutTitle'/><FieldRef Name='DocIcon'/><FieldRef Name='ServerUrl'/><FieldRef Name='Last_x0020_Modified'/> <FieldRef Name='Modified_x0020_By'/></ViewFields>
        <Query>
          ${query}
        </Query>
        <RowLimit Paged="FALSE">2000</RowLimit>
        </View>`
      }
    );
    return results.Row;
  }
    
  public async getViewsFields(list:any,fields:any){
    //let viewFields= await this.sp.web.lists.getByTitle(list).views.getByTitle(viewName).fields.select('InternalName', 'Title').get();
    
    let internames: string[] = fields.split(',');
    
    let filterstring: string = internames.map(x => `(InternalName eq '${x}')`).join(` or `);

    const displaynames = await this.sp.web.lists.getByTitle(list).fields.filter(filterstring).select('InternalName', 'Title')();

    let soryArray:any=[];
    for(let d=0;d<internames.length;d++){
      soryArray.push(displaynames.filter((x:any)=>x.InternalName==internames[d])[0]);
    }
    internames.push("Id");
    return {internalName:internames,fields:soryArray};
  }

  public async GetConfigDetailsbyTitle(title:string, listName:string) {
    let items: any[] = [];
    try {
      items = await this.sp.web.lists.getByTitle(listName).getItemsByCAMLQuery({
        ViewXml: `<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">`+ title +`</Value></Eq></Where></Query></View>`,
    });
    } catch (error) {
        return Promise.reject(error);
    }
    return items;
  }
    
  public async getChoiceFieldValue(list:any,column:any){
    const result = await this.sp.web.lists.getByTitle(list).fields.getByTitle(column)();
    return result;
  }

  public async saveListItem(list:any,payload:any){
    let result=await this.sp.web.lists.getByTitle(list).items.add(payload);
    return result;
  }

  public async updateListItem(list:any,payload:any,itemId:any){
    let result=await this.sp.web.lists.getByTitle(list).items.getById(itemId).update(payload);
    return result;
  }

  public async saveandUpdateListItem(list:any,payload:any){
    let result:any=await this.sp.web.lists.getByTitle(list).items.add(payload);
    await this.updateListItem(list,{"ServerUrl":`/sites/CTMS/Lists/Contractor Training Profiles/AME/test/${result.ID}_.000`,
    "EncodedAbsUrl":`/sites/CTMS/Lists/Contractor Training Profiles/AME/test/${result.ID}_.000`},result.ID)
    return result;
  }

  public async addAttachmentListItem(list:any,itemId:any,fileName:any,fileContent:any){
    let item=await this.sp.web.lists.getByTitle(list).items.getById(itemId);
    let result=await item.attachmentFiles.add(fileName, fileContent);
    return result;
  }

  public async deleteListItem(list:any,itemId:any){
    let result=await this.sp.web.lists.getByTitle(list).items.getById(itemId).delete();
    return result;
  }

  public async getCurrentUserPermission(list:any){
    let addPerm=await this.sp.web.lists.getByTitle(list).currentUserHasPermissions(PermissionKind.AddListItems);
    let deletePerm=await this.sp.web.lists.getByTitle(list).currentUserHasPermissions(PermissionKind.DeleteListItems);
    let editPerm=await this.sp.web.lists.getByTitle(list).currentUserHasPermissions(PermissionKind.EditListItems);

    return {Add:addPerm,Delete:deletePerm,Edit:editPerm};
  }

  public async getItemCount(webUrl:any) {
    try {      
        let redirectionURL = webUrl + "/_api/Web/Lists?$select=ItemCount,Title"      
        await this.spHttpClient.get(redirectionURL, SPHttpClient.configurations.v1).then(async (response: SPHttpClientResponse) => {        
            await response.json().then(async (responseJSON: any) => {  
                return responseJSON.value; 
            });        
          });    
         
    } catch (error) {      
        console.log("Error in getItemCount " + error);      
    }  
  }

  public readItems(webUrl: string,listName:any,selectCol:any,expandField:any,pageSize:any): Promise<any> {

    const url = `${webUrl}/_api/web/lists/GetByTitle('${listName}')/items?%24skiptoken=Paged%3dTRUE%26p_ID=3&$top=${pageSize}&$select=${selectCol}&$expand=${expandField}`;

    let result:any={};
    return new Promise((resolve) => {  
    this.spHttpClient.get(url,SPHttpClient.configurations.v1,    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'odata-version': ''
      }
    }).then((response: SPHttpClientResponse): Promise<{value: any[]}> =>{
    return response.json();
    }).then((response: {value: any[]}): void => {     
      //this.props.Status(`${response.d.__next}`);
      //this.props.siteUrl = response['odata.nextLink'];
      result={
        items: response.value,
        //columns: _buildColumns(response.value),
        status: response.value.length
      }; 
      resolve(result);      
    }, (error: any): void => {
      result={
        items: [],
        status: 'Loading all items failed with error: ' + error
      };
      resolve(result);   
    });    
  });   
  }

  public async getCurrentUser(){
    let result =await this.sp.web.currentUser();
    return result;
  }

  public async createListItemInFolder(listName:any, folderPath:any, itemProperties:any) {
  try {
    const list = this.sp.web.lists.getByTitle(listName);
    const result:any = await list.addValidateUpdateItemUsingPath(itemProperties, folderPath);

    let idField=result.filter((x:any)=>x.FieldName =="Id");
    if(idField.length>0) 
      return idField[0].FieldValue;
    else
      return null;
  } catch (error) {
    console.error("Error creating list item:", error);
    throw error;
  }
  }

  public parseObject(obj:any){
    let newObjectArray:any=[];
    Object.keys(obj).map((key,index)=>{
      newObjectArray.push({ FieldName: key, FieldValue:obj[key] });
    });
    return newObjectArray;
  }
  
}


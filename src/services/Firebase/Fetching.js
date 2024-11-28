
import { getAuth } from 'firebase/auth';
import { FIREBASE_AUTH,FIRESTORE_DB } from "./firebaseConfig";
import {collection,getDocs,getDoc,doc,query,orderBy,where} from 'firebase/firestore';

class Fetching{
    constructor(instance){
        this.instance=instance
    }
    fetchdata=async()=>{
        return await this.instance.fetchdata();
    }
}
class Fetchusername extends Fetching{
    constructor(){
        super();
    }
    fetchdata=async()=>{
        const names=collection(FIRESTORE_DB,'Users');
        const snapshot=await getDocs(names);
        const allusers=snapshot.docs.map(doc=>doc.data().username);
        return allusers;
    }
}
class Fetchemails extends Fetching{
    constructor(){
        super();
    }
    fetchdata=async()=>{
        const names=collection(FIRESTORE_DB,'Users');
        const snapshot=await getDocs(names);
        const allemails=snapshot.docs.map(doc=>doc.data().email);
        return allemails;
    }
}
class FetchChatGroups extends Fetching{
    constructor(){
        super();
    }
    fetchdata=async()=>{
        const user = getAuth().currentUser;

      if (user) {
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'Users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Username:', userData.username);
        const  currentUser=userData.username;
          const groups=collection(FIRESTORE_DB,'Groups');
          const snapshot=await getDocs(groups);
          const userGroups = snapshot.docs
          .filter(doc => {
            const groupMembers = doc.data().GroupMembers || [];
            return groupMembers.includes(currentUser);  
          })
          .map(doc => ({
            groupName: doc.data().GroupName,
            groupID: doc.id,  
        }));
        return userGroups
        }
      } 
    }
}
class FetchGroupDescription extends Fetching{
    constructor(){
        super();
    }
    fetchdata=async(groupName,groupID)=>{
        const g=collection(FIRESTORE_DB,'Groups');
        const snapshot=await getDocs(g);
        const g_d = snapshot.docs
          .filter(doc => {
            const data = doc.data();
            const groupn = data.GroupName || '';
            const gID=doc.id;
            return groupn==groupName && gID==groupID ;  
          })
          .map(doc => doc.data().GroupDescription);
          const groupdescription=g_d;
          console.log(groupdescription);
          return groupdescription;
    }
}
class FetchMessages extends Fetching{
    constructor(){
        super();
    }
    fetchdata=async(groupID)=>{
        const messagessnapshot=await getDocs(query(collection(FIRESTORE_DB,'Groups',groupID,'Messages'), orderBy('sendAt', 'asc')));
        const list=messagessnapshot.docs.map(doc=>({
            message: doc.data().message,
            sendby:doc.data().sender,
        }));
        return list;
    }
}
class FetchTasks extends Fetching{
    constructor(){
        super();
    }
    fetchdata=async()=>{
        const user=getAuth().currentUser;
        const userdoc=await getDoc(doc(FIRESTORE_DB,"Users",user.uid));
        const userData=userdoc.data();
        const name=userData.username;
        const tasksSnapshot = await getDocs(query(collection(FIRESTORE_DB, "tasks"),where("taskof","==",name)));
        const tasksList = tasksSnapshot.docs.map((doc) => ({
            id: doc.id, // Include the document ID
            ...doc.data(),
        }));
        return tasksList;
    }
}
export {Fetching,Fetchemails,Fetchusername,FetchChatGroups,FetchGroupDescription,FetchMessages,FetchTasks};

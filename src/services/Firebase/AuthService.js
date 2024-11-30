// import { FIREBASE_AUTH,FIRESTORE_DB } from '../../firebaseConfig';
import { FIREBASE_AUTH,FIRESTORE_DB } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {collection,getDocs,addDoc,getDoc,updateDoc} from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from 'firebase/auth';

class AuthService{
    constructor(instance){
        this.instance=instance
    }
    authenticate=async(formData)=>{
        return await this.instance.authenticate(formData)
    }
}
class LoginClass extends AuthService{
    constructor(){
        super();
    }
    authenticate=async(formData)=>{
        const auth=FIREBASE_AUTH;
        const userCredential = await signInWithEmailAndPassword(auth,formData.email, formData.password);
    }
}
class SignUpClass extends AuthService{
    constructor(){
        super();
    }
    authenticate=async(formData)=>{
        const auth=FIREBASE_AUTH;
        const userinfo=await createUserWithEmailAndPassword(auth,formData.email,formData.password);
        const user= userinfo.user;
    await setDoc(doc(FIRESTORE_DB, "Users", user.uid), {
        fullName: formData.fullname,
        username: formData.username,
        email: formData.email,
        password:formData.password,
        createdAt: new Date(),
      });
    }
}

class AddGroup extends AuthService{
    constructor(){
        super();
    }
    authenticate=async(formData)=>{
        const GroupCollection=collection(FIRESTORE_DB,"Groups");
        addDoc(GroupCollection,{
            GroupName:formData.GroupName,
            GroupDescription:formData.GroupDescription,
            GroupMembers:formData.GroupMembers,
            created_at:new Date(),
        })
    }
}
class SentMessage extends AuthService{
    constructor(){
        super();
    }
    authenticate=async(formData)=>{
        const user = getAuth().currentUser;
        const userDoc =await getDoc(doc(FIRESTORE_DB, 'Users', user.uid));
        const userData = userDoc.data();
        const uname=userData.username;
        const messageData={
            sender: uname,
            message: formData.message,
            sendAt: new Date(),
        }
        const groupmessages=collection(FIRESTORE_DB,'Groups',formData.groupID,'Messages');
        await addDoc(groupmessages,messageData);
    }
}
class AddTask extends AuthService{
    constructor(){
        super();
    }
    authenticate=async(formData)=>{
            const user=getAuth().currentUser;
            const userdoc=await getDoc(doc(FIRESTORE_DB,"Users",user.uid));
            const userData=userdoc.data();
            const name=userData.username;
      
            const tasksCollectionRef = collection(FIRESTORE_DB, "tasks");
            const docRef = await addDoc(tasksCollectionRef, {
              title:formData.title,
              dueDate:formData.dueDate,
              chapter:formData.chapter,
              description:formData.description,
              completed: false, // Default task state
              taskof: name,
            });
    }
}
class UpdateTask extends AuthService{
    constructor(){
        super();
    }
    authenticate=async(formData)=>{
    const taskRef = doc(FIRESTORE_DB, "tasks",formData.taskId );
      await updateDoc(taskRef, {
        title:formData.title,
        dueDate:formData.dueDate,
        chapter:formData.chapter,
        description:formData.description
      });
    }
}
class updateUserinfo extends AuthService {
    constructor() {
      super();
    }
  
    authenticate = async (formData) => {
        const user = getAuth().currentUser;
        const userdoc = await getDoc(doc(FIRESTORE_DB, 'Users', user.uid));
  
        await updateDoc(userdoc.ref, {
          fullName: formData.fullName,
        });
  }
}
export { LoginClass ,AuthService,SignUpClass,AddGroup,SentMessage,AddTask,UpdateTask,updateUserinfo};
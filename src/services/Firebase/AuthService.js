import { FIREBASE_AUTH, FIRESTORE_DB } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class AuthService {
    constructor(instance) {
        this.instance = instance;
    }
    authenticate = async (formData) => {
        return await this.instance.authenticate(formData);
    };
}

class LoginClass extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const auth = FIREBASE_AUTH;
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    };
}

class SignUpClass extends AuthService {
    constructor() {
        super();
    }

    authenticate = async (formData) => {
        const auth = FIREBASE_AUTH;
        const userinfo = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userinfo.user;

        // Create user entry in Firestore
        await setDoc(doc(FIRESTORE_DB, "Users", user.uid), {
            fullName: formData.fullname,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            createdAt: new Date(),
        });

        // Create fitness stats table for the user
        await setDoc(doc(FIRESTORE_DB, "Fitness", user.uid), {
            stepCount: 0,
            calories: 0,
            sleepHours: 0,
            waterIntake: 0,
            goalCalories: 1000, // Default calorie goal
            stepGoal: 10000,    // Default step goal
            createdAt: new Date(),
            waterGoal: 2,
            height: 5.4,
            weight: 60,
            sleepGoal: 8
        });

        // Create alarms table for the user with default alarms
        const alarmsCollectionRef = collection(FIRESTORE_DB, "Alarms");
        const defaultAlarms = [
            { time: "7:00 AM", days: "Mon, Tues, Wed, Thu, Fri", enabled: true },
            { time: "10:00 PM", days: "Sat, Sun", enabled: false }
        ];

        for (const alarm of defaultAlarms) {
            await addDoc(alarmsCollectionRef, {
                ...alarm,
                userId: user.uid, // Associate the alarm with the user
                createdAt: new Date()
            });
        }
    };
}


class AddGroup extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const GroupCollection = collection(FIRESTORE_DB, "Groups");
        await addDoc(GroupCollection, {
            GroupName: formData.GroupName,
            GroupDescription: formData.GroupDescription,
            GroupMembers: formData.GroupMembers,
            created_at: new Date(),
        });
    };
}

class SentMessage extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const user = getAuth().currentUser;
        const userDoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
        const userData = userDoc.data();
        const uname = userData.username;

        const messageData = {
            sender: uname,
            message: formData.message,
            sendAt: new Date(),
        };

        const groupMessages = collection(FIRESTORE_DB, "Groups", formData.groupID, "Messages");
        await addDoc(groupMessages, messageData);
    };
}

class AddTask extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const user = getAuth().currentUser;
        const userDoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
        const userData = userDoc.data();
        const name = userData.username;

        const tasksCollectionRef = collection(FIRESTORE_DB, "tasks");
        await addDoc(tasksCollectionRef, {
            title: formData.title,
            dueDate: formData.dueDate,
            chapter: formData.chapter,
            description: formData.description,
            completed: false, // Default task state
            taskof: name,
        });
    };
}

class UpdateTask extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const taskRef = doc(FIRESTORE_DB, "tasks", formData.taskId);
        await updateDoc(taskRef, {
            title: formData.title,
            dueDate: formData.dueDate,
            chapter: formData.chapter,
            description: formData.description,
        });
    };
}

class updateUserinfo extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const user = getAuth().currentUser;
        const userDoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));

        await updateDoc(userDoc.ref, {
            fullName: formData.fullName,
        });
    };
}

export { LoginClass, AuthService, SignUpClass, AddGroup, SentMessage, AddTask, UpdateTask, updateUserinfo };

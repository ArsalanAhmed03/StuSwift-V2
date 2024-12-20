import { getAuth } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "./firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where,
  updateDoc,
  setDoc
} from "firebase/firestore";

class Fetching {
  constructor(instance) {
    this.instance = instance;
  }
  fetchdata = async () => {
    return await this.instance.fetchdata();
  };
}
class Fetchusername extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async () => {
    const names = collection(FIRESTORE_DB, "Users");
    const snapshot = await getDocs(names);
    const allusers = snapshot.docs.map((doc) => doc.data().username);
    return allusers;
  };
}
class FetchUsernameByEmail extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async (email) => {
    if (!email) throw new Error("Email is required");

    const usersCollection = collection(FIRESTORE_DB, "Users");
    const snapshot = await getDocs(
      query(usersCollection, where("email", "==", email))
    );

    if (snapshot.empty) {
      throw new Error("No user found with the provided email");
    }

    // Assuming there's only one user with the email
    const userDoc = snapshot.docs[0];
    const username = userDoc.data().username;

    return username;
  };
}

class Fetchemails extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async () => {
    const names = collection(FIRESTORE_DB, "Users");
    const snapshot = await getDocs(names);
    const allemails = snapshot.docs.map((doc) => doc.data().email);
    return allemails;
  };
}
class FetchChatGroups extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async () => {
    const user = getAuth().currentUser;

    if (user) {
      const userDoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentUser = userData.username;
        const groups = collection(FIRESTORE_DB, "Groups");
        const snapshot = await getDocs(groups);
        const userGroups = snapshot.docs
          .filter((doc) => {
            const groupMembers = doc.data().GroupMembers || [];
            return groupMembers.includes(currentUser);
          })
          .map((doc) => ({
            groupName: doc.data().GroupName,
            groupID: doc.id,
          }));
        return userGroups;
      }
    }
  };
}
class FetchGroupDescription extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async (groupName, groupID) => {
    const g = collection(FIRESTORE_DB, "Groups");
    const snapshot = await getDocs(g);
    const g_d = snapshot.docs
      .filter((doc) => {
        const data = doc.data();
        const groupn = data.GroupName || "";
        const gID = doc.id;
        return groupn == groupName && gID == groupID;
      })
      .map((doc) => doc.data().GroupDescription);
    const groupdescription = g_d;
    return groupdescription;
  };
}
class FetchMessages extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async (groupID) => {
    const messagessnapshot = await getDocs(
      query(
        collection(FIRESTORE_DB, "Groups", groupID, "Messages"),
        orderBy("sendAt", "asc")
      )
    );
    const list = messagessnapshot.docs.map((doc) => ({
      message: doc.data().message,
      sendby: doc.data().sender,
    }));
    return list;
  };
}
class FetchTasks extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async () => {
    const user = getAuth().currentUser;
    const userdoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
    const userData = userdoc.data();
    const name = userData.username;
    const tasksSnapshot = await getDocs(
      query(collection(FIRESTORE_DB, "tasks"), where("taskof", "==", name))
    );
    const tasksList = tasksSnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(),
    }));
    return tasksList;
  };
}
class FetchAllData extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async () => {
    const user = getAuth().currentUser;
    const userdoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
    const userData = userdoc.data();
    return userData;
  };
}
class FetchCurrentUserEmail extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async () => {
    const user = getAuth().currentUser;
    const userdoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
    const userData = userdoc.data();
    return userData.email;
  };
}

class FetchFitnessData extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("User not authenticated");
      const fitnessDoc = await getDoc(doc(FIRESTORE_DB, "Fitness", user.uid));
      if (fitnessDoc.exists()) {
        return fitnessDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching fitness data:", error);
      throw error;
    }
  };
}

class UpdateFitnessData extends Fetching {
  constructor() {
    super();
  }
  fetchdata = async (data) => {
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("User not authenticated");

      const fitnessDocRef = doc(FIRESTORE_DB, "Fitness", user.uid);
      await updateDoc(fitnessDocRef, data, { merge: true });
    } catch (error) {
      console.error("Error updating fitness data:", error);
      throw error;
    }
  };
}

class FetchAlarms extends Fetching {
  constructor() {
    super();
  }

  fetchdata = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("User not authenticated");

      const alarmsCollection = collection(FIRESTORE_DB, "Alarms");
      const alarmsSnapshot = await getDocs(
        query(alarmsCollection, where("userId", "==", user.uid))
      );

      const alarms = alarmsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return alarms;
    } catch (error) {
      console.error("Error fetching alarms:", error);
      throw error;
    }
  };
}

class UpdateOrAddAlarm extends Fetching {
    constructor() {
      super();
    }
  
    fetchdata = async (alarmData, alarmId = null) => {
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error("User not authenticated");
  
        const alarmsCollection = collection(FIRESTORE_DB, "Alarms");
  
        if (alarmId) {
          // Update existing alarm
          const alarmDocRef = doc(FIRESTORE_DB, "Alarms", alarmId);
          await updateDoc(alarmDocRef, { ...alarmData, userId: user.uid });
        } else {
          // Add new alarm
          const newAlarmDocRef = doc(alarmsCollection);
          await setDoc(newAlarmDocRef, { ...alarmData, userId: user.uid });
        }
  
        return true;
      } catch (error) {
        console.error("Error adding or updating alarm:", error);
        throw error;
      }
    };
  }
  

export {
  Fetching,
  Fetchemails,
  Fetchusername,
  FetchChatGroups,
  FetchGroupDescription,
  FetchMessages,
  FetchTasks,
  FetchAllData,
  FetchCurrentUserEmail,
  FetchFitnessData,
  UpdateFitnessData,
  FetchAlarms,
  UpdateOrAddAlarm
};

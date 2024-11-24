import {useState} from 'react';
import {Text,View,StyleSheet,ScrollView,Image,TouchableOpacity,TextInput,FlatList,Modal} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Fetchusername} from './Fetching';
import { AddGroup,AuthService } from './Authentication'; 

export  function Creategroup({ navigation }){

    const [showDropdown, setShowDropdown] = useState(false);
    const[usernames,setusernames]=useState([]);

    const [formData, setFormData] = useState({
        GroupName:'',
        GroupDescription:'',
        GroupMembers:[],
      });

    const fetchusers=async()=>{
        const getallusernames=new Fetchusername();
        const usernamesinfo=await getallusernames.fetchdata();
        setusernames(usernamesinfo);
    }
    fetchusers();

    const handleSelectID = (selectedUsername) => {
        setFormData((prevState) => {
            let updatedMembers = [...prevState.GroupMembers];

            if (updatedMembers.includes(selectedUsername)) {
                updatedMembers = updatedMembers.filter((username) => username !== selectedUsername);
            } else {
                updatedMembers.push(selectedUsername);
            }

            return { ...prevState, GroupMembers: updatedMembers };
        });
    };


    function handle_creategroup(){
        if(!formData.GroupName || !formData.GroupDescription || !formData.GroupMembers){
            alert('Fill all the Feilds');
            return;
        }
        const AddgroupInstance=new AddGroup();
        const GroupCreated=new AuthService(AddgroupInstance);
        GroupCreated.authenticate(formData);
        alert("Group Created Successfully!");
        navigation.navigate('Chats Page');
    }

    return(
        <View style={creategroupstyles.maincontainer}>
            <>
        <View style={creategroupstyles.HeadingContainer}>
        <View style={creategroupstyles.ArrowContainer}>
            <TouchableOpacity onPress={()=>navigation.navigate('Chats Page')}>
            <Ionicons name="arrow-back-sharp" size={30} color="black" cursor="pointer"/>
            </TouchableOpacity>
        </View>
            <Text style={creategroupstyles.Heading}>Connect People</Text>
        </View>
        <View style={creategroupstyles.GroupiconContainer}>
            <Ionicons  size={60} name="people-circle" />
        </View>
        <View style={creategroupstyles.bodyContainer}>
            <TextInput style={creategroupstyles.bodyText} value={formData.GroupName} onChangeText={(text)=>setFormData({...formData,GroupName:text})}  placeholder='Group Name'></TextInput>
        </View>
        <View style={creategroupstyles.bodyContainer}>
            <TextInput style={creategroupstyles.bodyText} value={formData.GroupDescription} onChangeText={(text)=>setFormData({...formData,GroupDescription:text})}  placeholder='Description'></TextInput>
        </View>
        <View style={creategroupstyles.bodyContainer}>
            <TextInput style={creategroupstyles.bodyText} value={formData.GroupMembers.join(', ')} onChangeText={(text)=>setFormData({...formData,GroupMembers:text})}  placeholder="Select Usernames"></TextInput>
                <TouchableOpacity style={creategroupstyles.select_plusPress} onPress={()=>setShowDropdown(true)}>
                    <Ionicons name="add-outline" size={25} color="white" />
                </TouchableOpacity>
        </View>
        <Modal visible={showDropdown} transparent={true} animationType="fade">
           <View style={creategroupstyles.modalContainer}>
             <View style={creategroupstyles.dropdownContainer}>
               <FlatList
              data={usernames}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={creategroupstyles.dropdownItem} onPress={() => handleSelectID(item)}>
                  <Text style={creategroupstyles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={creategroupstyles.closeButton} onPress={() => setShowDropdown(false)}>
              <Text style={creategroupstyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


        <View style={creategroupstyles.buttoncontainer}>
        <TouchableOpacity style={creategroupstyles.creategroupbutton} onPress={handle_creategroup}>
            <Text style={creategroupstyles.creategrouptext} >Create a Group</Text>
        </TouchableOpacity>
        </View>
        </>
        </View>
    );
}
const creategroupstyles=StyleSheet.create({
    maincontainer:{
        flex:1,
        backgroundColor:'white'
    },
       HeadingContainer:{
        flexDirection: 'row',
        justifyContent: 'center', 
    },
    Heading:{
        fontSize:30,
        fontWeight:'bold',
    },
    ArrowContainer:{
        position:'absolute',
        top:10,
        left:8
    },
    GroupiconContainer:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:40
    },
    bodyContainer:{
        marginHorizontal: 10, 
        marginTop: 60,
    },
    bodyText:{
        color: 'black',
        fontSize: 15,
        borderBottomColor: '#3B3B98',
        borderTopColor:'white',
        borderLeftColor:'white',
        borderRightColor:'white',
        borderBottomWidth:2,
        borderRadius: 5,
        padding: 5,
    },
    buttoncontainer:{
        flexDirection: 'row',
        justifyContent: 'center', 
        marginTop: 20,
    },
    creategroupbutton:{
        backgroundColor:'#3B3B98',
        height:50,
        width:160,
        borderRadius:15,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    creategrouptext:{
        color:'white',
        textAlign: 'center',
       
    },
    select_plusPress:{
        position: 'absolute',
        right: 10, 
        top: '50%',
        marginTop: -15, 
        backgroundColor: '#3B3B98',
        borderRadius:20,
    },
    Modalstyles: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          dropdownContainer: {
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
          },
          dropdownItem: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
          },
          dropdownText: {
            fontSize: 18,
          },
          closeButton: {
            marginTop: 20,
            backgroundColor: '#3B3B98',
            borderRadius: 10,
            padding: 10,
            alignItems: 'center',
          },
          closeButtonText: {
            color: 'white',
            fontSize: 16,
          },
    });


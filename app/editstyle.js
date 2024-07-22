import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      height:'100%',
      width: '100%',
      backgroundColor: '#000',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      alignSelf: 'flex-start',
    },

    closeButtonText: {
      fontSize: 24,
      color: '#fff',
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    label: {
      fontSize: 18,
      color: '#fff',
      flex: 1,
      marginLeft:10,
    },
    labeltop: {
      fontSize: 18,
      color: '#fff',
      flex: 1,
      textAlign: 'center',
    },
    value: {
      fontSize: 18,
      color: '#fff',
      flex: 2,

    },
    val: {
      fontSize: 18,
      color: '#fff',
      flex: 2,
      backgroundColor: '#333',
      borderRadius:4,
      padding:4,
    },
    input: {
      backgroundColor: '#fff',
      color: '#000',
      borderRadius: 5,
      padding: 10,
      flex: 2,
    },
    descriptionInput: {
      height: 80,
    },
    deleteIconRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    deleteIcon: {
      padding: 10,
    },
    deleteText: {
      color: 'red',
      marginLeft: 5,
      fontSize: 18,
    },
  
    
    editRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 2,
    },
    editIcon: {
      marginLeft: 10,
    },
    
    
    icon: {
      marginHorizontal: 10,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 5,
    },
    deleteButton: {
      backgroundColor: '#ff0000',
      padding: 10,
      borderRadius: 5,
    },
    
    closePriorityButton: {
      alignSelf: 'flex-end',
    },
    closePriorityButtonText: {
      fontSize: 18,
      color: '#000',
      fontWeight: 'bold',
    },
    
    
   
    



    categoryModalView: {
      height: '70%',
      width: '100%',
      backgroundColor: '#333',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'flex-start',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  
    categoryGrid: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 20,
    },
  
    categoryItemContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10, // Adjust margin for spacing
      backgroundColor: '#333',
      borderRadius: 10,
      padding: 15,
    },
  
    categoryIcon: {
      width: 50,
      height: 50,
      marginBottom: 5,
    },
  
    categoryItemText: {
      color: '#fff',
      textAlign: 'center',
    },
  
    categoryButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20,
    },
  
    categoryButton: {
      flex: 1,
      marginHorizontal: 5,
      borderRadius: 5,
      backgroundColor: '#8687E7',
      padding: 10,
      alignItems: 'center',
    },
  
    categoryButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    cancelButton: {
      flex: 1,
      marginHorizontal: 5,
      borderRadius: 5,
      backgroundColor: 'transparent',
      padding: 10,
      alignItems: 'center',
    },
    ct:{
      fontSize: 16,

      color:'#8687E7',

    },
  });


export default styles ;
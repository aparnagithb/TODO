// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 11,
    },
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    indexText: {
      fontSize: 24,
      color: '#fff',
      textAlign: 'center',
      flex: 1,
    },
    profileIcon: {
      position: 'absolute',
      right: 10,
      top: 10,
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 45,
    },
    centerImage: {
      width: 280,
      height: 280,
      marginBottom: 20,
    },
    centerText: {
      fontSize: 20,
      color: '#fff',
      marginBottom: 10,
    },
    centerSubText: {
      fontSize: 16,
      color: '#888',
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 24,
      borderTopWidth: 1,
      borderTopColor: '#333',
    },
    navButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 15,
    },
    selectedColorBox: {
      borderWidth: 3, // Thickness of the border
      borderColor: '#000', // Color of the border
    },
    
    buttonIcon: {
      width: 30,
      height: 30,
      backgroundColor: 'black', // Ensure transparency is respected
    },
    addButtonContainer: {
      position: 'absolute',
      top: -15, // Adjust to position the button above the navbar line
      backgroundColor: '#8875FF', // Circle background color
      left: 172,
      borderRadius: 100,
      width: 55, // Circle diameter
      height:55, // Circle diameter
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1, // Ensure it appears above other elements
    },
    addButtonText: {
      fontSize: 25,
      color: '#fff',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
    },
    modalContent: {
      backgroundColor: '#333',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign:'center',
      color: '#fff',
    },
    modalTitleUnderline: {
      borderBottomWidth: 1,
      marginBottom: 10,
      borderBottomColor: '#fff', // Change the underline color to white
  
  
  
    },
    input: {
      borderWidth: 1,
      color:'#fff',
      borderColor: '#fff',
      padding: 8,
      marginBottom: 10,
      borderRadius: 5,
    },
    imagePickerButton: {
      backgroundColor: '#808080',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      width:'50%',
    },
    imagePickerButtonText: {
      color: '#fff',
      textAlign: 'center',
    },
    saveButton: {
      backgroundColor: '#8687E7',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    saveButtonText: {
      color: '#fff',
      textAlign: 'center',
    },
    closeButton: {
      position: 'absolute', // Position absolute to move it within the modal content
      top: 10, // Adjust as needed
      right: 10, // Adjust as needed
      padding: 10,
      borderRadius: 5,
    },
    closeButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    closeButtonBottom: {
      position: 'absolute', // Position absolute to move it within the modal content
      top: 10, // Adjust as needed to position at the bottom
      right: 10, // Adjust as needed
      padding: 10,
      borderRadius: 5,
    },
  
    addCategoryButton: {
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      backgroundColor: '#8687E7',
    }
   ,
    addCategoryButtonText: {
      color: '#fff',
      textAlign: 'center',
    },
    categoryList: {
      flexGrow: 0, // To ensure the FlatList does not grow infinitely
    },
    categoryItem: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
      width: '30%', // Adjust based on the number of columns
      backgroundColor: 'transparent',
      padding: 10,
      borderRadius: 5,
    },
    categoryIcon: {
      width: 50,
      height: 50,
  
    },
    categoryName: {
      marginTop: 5,
      textAlign: 'center',
      color: '#fff',
  
    },
    previewIcon: {
      width: 50,
      height: 50,
      marginTop: 10,
      marginBottom: 10,
    },
    inputContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 5,
    },
    categoryIconOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Default overlay color with 30% opacity
    },
    
    rowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    label: {
      color: '#ccc',
      fontSize: 12,
    },
    taskItem: {
      backgroundColor: '#333',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
  
    categoryPriorityRow: {
      justifyContent: 'flex-end',
    },
    label: {
      color: '#ccc',
      fontSize: 13,
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginLeft: 5, // Adjust margin as needed
    },
    taskDetails: {
      color: '#fff',
      marginLeft: 5, // Adjust margin as needed
    },
    priorityIcon: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color:'white',
    },
    colorPickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
    },
    
    colorBox: {
      width: 40,
      height: 40,
      borderRadius: 20, // Makes it circular
    },
    categoryItem: {
      flex: 1,
      alignItems: 'center',
      margin: 5,
    },
    iconContainer: {
      width: 60,
      height:60,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    categoryIcon: {
      width: '100%',
      height: '100%',
    },
    iconOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.6, // Adjust opacity as needed
    },
    categoryName: {
      marginTop: 5,
      textAlign: 'center',
      color:'white',
    },
    
  });
  export default styles ;
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {permissionAlert} from "../../utils/ComonHelper";
import {Platform} from 'react-native'

const Types = {
  photo:{
    android:PERMISSIONS.ANDROID.CAMERA,
    ios:PERMISSIONS.IOS.PHOTO_LIBRARY
  },
  camera:{
    android:PERMISSIONS.ANDROID.CAMERA,
    ios:PERMISSIONS.IOS.CAMERA
  },
  location:{
    android:PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios:PERMISSIONS.IOS.LOCATION_ALWAYS
  },
  microphone:{
    android:PERMISSIONS.ANDROID.RECORD_AUDIO,
    ios:PERMISSIONS.IOS.MICROPHONE
  }
}

export function checkPermission(key, callBack) {
  check(Platform.select(Types[key]))
  .then(result => {
    
    switch (result) {
      case RESULTS.UNAVAILABLE:
       
       permissionAlert('This feature is not available (on this device / in this context)')
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        callBack && callBack(true)
        
        break;
      case RESULTS.GRANTED:
        callBack && callBack(true)
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        permissionAlert('The permission is denied and not requestable anymore')
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  })
  .catch(error => {
    // …
  });
}
import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet, TouchableHighlight, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
import api from '../services/api';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

export default function Camera() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [searchPatient, setPatient] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [bed , setBed] = useState('');
  const [name, setName] = useState('');
  const [originAttendance, setOriginAttendance] = useState('');
  const [attendance, setAttendance] = useState('');
  const [statusPatient, setStatusPatient] = useState('');
  const [imageSuccess, setImageSuccess] = useState(false);
  const [imageWarning, setImageWarning] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const handleBarCodeScanned = ({ type, data }) => {
    setPatient(data);
    
    api.get(`/RouteAPI/${searchPatient}`).then
    (info => {
    if(info.data.status === "ALTAINTERNO" || info.data.status === "ALTAURGENCIA"){
      setAttendance(info.data.attendancePatient);
      setBed(info.data.bed);
      setName(info.data.name);
      setOriginAttendance(info.data.originAttendance);
      setStatusPatient('ALTA MÉDICA');
      setImageWarning(false);
      setImageSuccess(true);
      setScanned(true);
      setModalVisible(true);
    }else if(info.data.status === "URGENCIA" || info.data.status === "INTERNO"){
      setAttendance(info.data.attendancePatient);
      setBed(info.data.bed);
      setName(info.data.name);
      setOriginAttendance(info.data.originAttendance);
      setStatusPatient('SEM ALTA MÉDICA');
      setImageSuccess(false);
      setImageWarning(true);
      setScanned(true);
      setModalVisible(true);
    }
    }); 
      
    
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão a câmera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso a câmera</Text>;
  }

  return (
    <View style={styles.body}>     
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}>
        <Image style={styles.qr}/>
      </BarCodeScanner>
      {scanned && (<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(false)}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{statusPatient}</Text>
            {imageSuccess &&(<Image
              style={{ width: 125, height: 125}}
              source={require('./assets/success.gif')}
            />)}
            {imageWarning &&(<Image
              style={{ width: 125, height: 125}}
              source={require('./assets/atention.gif')}
            />)}
            <Text style={styles.textStyle }>{name}</Text>
            <Text style={styles.textStyle }>{bed}</Text>
            <Text style={styles.textStyle }>{originAttendance}</Text>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={() => {
                setModalVisible(false);
                setScanned(false);
                setImageSuccess(false);
                setImageWarning(false);
                setPatient('');
              }}>
              <Text style={styles.textbutton}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  body:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  qr: {
    marginTop: '10%',
    marginBottom: '40%',
    width: qrSize,
    height: qrSize,
    borderWidth: 2,
    borderColor: '#00995D',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'transparent',
  },
  modalView: {
    margin: 2,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#00995D',
    borderRadius: 10,
    padding: 12,
    elevation: 2
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
  },
  textbutton: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize : 35,
  },
});

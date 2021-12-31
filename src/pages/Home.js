import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import RequestHome from './RequestHome';

class Home extends React.Component{

    render(){
        return(
        <View>
            <RequestHome/>
        </View>
        );
    }

}

export default Home;
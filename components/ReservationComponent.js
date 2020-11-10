import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
    Picker, Switch, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';


class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false
        };
    }

    static navigationOptions = {
        title: 'Make a Reservation'
    }

    handleReservation() {

        const AlertMsg = `
        Number of Guests: ${this.state.guests} \n
        Outdoors? ${this.state.outdoor} \n 
        Date: ${this.state.date.toLocaleDateString('en-US')}`
        
        Alert.alert(
            'Request Reservation?',
            AlertMsg,
            [
                {
                    text: 'Cancel',
                    onPress: () => {this.resetForm()},
                    style: 'cancel'
                    
                },
                {
                    text: 'OK',
                    
                    onPress: () => {
                        this.resetForm();
                        this.presentLocalNotification(this.state.date.toLocaleDateString('en-US'));
                    }
                }
            ],
            { cancelable: false }
        )
    }

    resetForm() {
        this.setState({
            guests: 1,
            outdoor: false,
            date: new Date(),
            showCalendar: false
        });
    }

    async presentLocalNotification(date) {
        function sendNotification() {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true
                })
            });

            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Your Reservation Request',
                    body: `Your reservation for ${date} has been requested. You will receive an email shortly once your reservation has been approved.`
                },
                trigger: null
            });
        }

        let permissions = await Notifications.getPermissionsAsync();
        if (!permissions.granted) {
            permissions = await Notifications.requestPermissionsAsync();
        }
        if (permissions.granted) {
            sendNotification();
        }
    }

    render() {
        return (
            
            <ScrollView>
                <Animatable.View animation='zoomIn' duration={2000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={itemValue => this.setState({guests: itemValue})}
                        >
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                            <Picker.Item label='7' value='1' />
                            <Picker.Item label='8' value='2' />
                            <Picker.Item label='9' value='3' />
                            <Picker.Item label='10' value='4' />
                            <Picker.Item label='11' value='5' />
                            <Picker.Item label='12' value='6' />
                            
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Outdoor Seating?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.outdoor}
                            trackColor={{true: '#5637DD', false: null}}
                            onValueChange={value => this.setState({outdoor: value})}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date</Text>
                        <Button
                            onPress={() =>
                                this.setState({showCalendar: !this.state.showCalendar})
                            }
                            title={this.state.date.toLocaleDateString('en-US')}
                            color='#5637DD'
                            accessibilityLabel='Tap me to select a reservation date'
                        />
                    </View>
                    {this.state.showCalendar && (
                        <DateTimePicker
                            value={this.state.date}
                            mode={'date'}
                            display='default'
                            onChange={(event, selectedDate) => {
                                selectedDate && this.setState({date: selectedDate, showCalendar: false});
                            }}
                            style={styles.formItem}
                        />
                    )}
                    <View style={styles.formRow}>
                        <Button
                            title='Search'
                            color='#5637DD'
                            accessibilityLabel='Tap me to search for available campsites to reserve'
                            onPress={() => this.handleReservation()}
                        />
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }

});

export default Reservation;
import React, {Component} from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, TextInput } from 'react-native';
import { Card, Icon, Rating } from 'react-native-elements';
import { CAMPSITES } from '../shared/campsites';
import { COMMENTS } from '../shared/comments'
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites

        
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text))
};

function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating readonly startingValue={item.rating} imageSize={10} style={{alignItems: 'flex-start', paddingVertical:'5%'}}></Rating>
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}


function RenderCampsite(props) {
    const {campsite} = props;
    if (campsite) {

        return (
            <Card
                featuredTitle={campsite.name}
                image={{uri: baseUrl + campsite.image}}>
                <Text style={{margin: 10}}>
                    {campsite.description}
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={() => props.favorite ? 
                            console.log('Already set as a favorite') : props.markFavorite()}
                    />
                    <Icon
                        name={'pencil'}
                        type='font-awesome'
                        color='#5637DD'
                        raised
                        reverse
                        onPress={() => props.onShowModal()}
                    />
                </View>
            </Card>
        );
    }
    
    return <View />;
}



class CampsiteInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
            favorite: false,
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        };
    }

    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            text: '',
            showModal: false
        });
    }

    handleComment(campsiteId) {
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text)
        this.toggleModal();
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments} />

                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating 
                            onFinishRating={rating => this.setState({rating: rating})} 
                            style={{paddingVertical: 10}}
                            startingValue={this.state.rating}
                            imageSize={40}
                            showRating
                        />
                        <TextInput
                            placeholder={'Author'}
                            leftIcon={<Icon type= 'font-awesome' name= 'user-o' />}

                            leftIconContainerStyle={{paddingRight: 10}}
                           
                            onChangeText={author => this.setState({author: author})}
                             value={this.state.author}
                        />

                        
                        <TextInput
                            placeholder={'Text'}
                            leftIcon={<Icon type= 'font-awesome' name= 'comment-o' />}    

                            leftIconContainerStyle={{paddingRight: 10}}
                            
                            onChangeText={text => this.setState({text: text})}
                            value={this.state.text}
                        />
                        
                        <Button
                            title='Submit'
                            color='#5637DD'

                            onPress={() => {
                                
                                this.handleComment(campsiteId);
                                this.resetForm();
                            }}
                        />
                        <View style={{margin: 10}}>
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                                color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
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
    },
    modal: { 
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#5637DD',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }

});


export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
import React, {Component} from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { Card } from 'react-native-elements';

import styles from './style'
import axios from 'axios';

export default class Post extends Component {
    static navigationOptions = {
        title: "Post",
    }

    componentWillMount() {
        axios.get('http://18.221.224.217:8080/get/post', {params: {post_id: this.state.post_id}})
            .then(res => {
                this.setState({post: res.data});
                for (const answer_id of res.data.answer_ids){
                    console.log(answer_id);
                    axios.get('http://18.221.224.217:8080/get/answer', {params: {answer_id: answer_id}})
                    .then(res => {
                        var joined = this.state.answers.concat(res.data);
                        this.setState({answers: joined});
                    })
                }
            })
    }

    constructor(props) {
        super();
        this.navigation = props.navigation;
        this.state = {
            post_id: props.navigation.state.params.post_id,
            post: null,
            answers: [],
        };
    }

    _renderAnswer = answer =>{
        console.log("~~~~~~~~~~~~~~~~~~answer")
        return (
            <Card>
                <Text>
                    {answer.content}
                </Text>
            </Card>
        )
    }

    render() {
        return (
            <View
                style={styles.container}
            >
                {this.state.post ?
                <View>
                <Card>
                    <Text
                        style={styles.title}
                    >
                        {this.state.post.post_summary.title}
                    </Text>
                    <Text
                        style={styles.smalltext}
                    >
                        {this.state.post.post_summary.user_info.last_name}
                    </Text>
                    <Text
                        style={styles.smalltext}
                    >
                        {this.state.post.post_summary.timestamp_update}
                    </Text>
                </Card>
                <Card>
                    <Text>
                        {this.state.post.content}
                    </Text>
                </Card>
                <FlatList
                    data={this.state.answers}
                    renderItem={({item}) => this._renderAnswer(item)}
                    keyExtractor={item => item.answer_id}
                />
                <Button
                    onPress={() => this.navigation.navigate('AnswerScreen',
                    {post_id: this.state.post.post_summary.post_id})}
                    title="add your answer"
                    style={styles.buttonText}
                />
                </View>
            : <View/>}
            </View>
        );
    }
}
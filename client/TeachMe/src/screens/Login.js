import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
  } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../redux/actions';

class Login extends Component {
  static navigationOptions = {
    title: 'Login',
    headerLeft: null
  }

  constructor(props) {
      super();
      this.navigation = props.navigation;
      this.state = {
          email: props.userInfo.email,
          password: props.userInfo.password,
          showTheThing: false,
      }
  }
  changeReduxStore(userInfo) {
        this.props.setUserInfo(userInfo);
    };

 showError() {
   this.setState({showTheThing: true});
 };

  login() {
    userInfo = {
      user_id: '',
      first_name: '',
      last_name: '',
      email: this.state.email,
      password: this.state.password,
    };
    axios.get('http://18.221.224.217:8080/login', {params:{user_info: userInfo}})
    .then(res => {
        if(res.status == 404){
          // login failed
          this.setState({email:'', password:''});
          //  add error message to user
        }
        else if (res.status == 200){
          // login succeeded
          console.log("login\\\\\\\\\\\\\\\\\\")
          console.log(res.data)
          this.changeReduxStore(res.data);
          this.navigation.navigate('BottomTab', {email: this.state.email});
        }
    })
    .catch(error => {
        console.log(error.response)
        this.showError();
    });
  }

  register = () => {
    this.navigation.navigate('SignUp');
  };

  render() {
    return (
        <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../images/logo4.jpg')}
            />
            <Text style={styles.title}>TeachMe</Text>
          </View>
          <View style={styles.formContainer}>
            { this.state.showTheThing &&
            <TouchableOpacity
              style={styles.errorContainer}
            >
              <Text style={styles.errorText}>Incorrect username or password</Text>
            </TouchableOpacity>
            }
            <TextInput
              autoCapitalize = 'none'
              style={styles.input}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
            <TextInput
              secureTextEntry
              style={styles.input}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.login()}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.navigation.navigate('SignUp')}
            >
              <Text style={styles.buttonText}>SIGNUP</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    );
  }
}

function mapStateToProps(state) {
    return { userInfo: state.reducers.userInfo };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: '3%',
  },
  logoContainer: {
    alignItems: 'center',
    //flexGrow: 1,
    justifyContent: 'center',
    marginTop:'5%',
    //borderColor:'black',
    //borderWidth:1,
    height:'40%'
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius:75,
    
  },
  title: {
    color: '#1a8cff',
    marginTop: '8%',
    width: 160,
    textAlign: 'center',
    opacity: 0.9,
    fontSize: 25, fontWeight: 'bold'

  },
  input: {
    height: '15%',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#FFF',
    marginBottom: '6%',
    color: '#000000',
    paddingHorizontal: 20,
    
  },
  errorText: {
    color: 'red'
  },
  buttonContainer: {
    marginBottom: '2%',
    backgroundColor: '#1a8cff',
    paddingVertical: '4%'
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '700'
  },
  formContainer:{
    marginTop:'10%'

  }
});

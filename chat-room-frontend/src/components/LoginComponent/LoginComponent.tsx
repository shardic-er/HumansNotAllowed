import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, {ChangeEvent, useState} from "react";
import {AppUser} from "../../Utils/Interfaces";
import {login, register} from "../../Utils/functions";

// pretend that the response from Auth server looks like this.
const exampleUser: AppUser = {
    username:'login',
    password:'pass',
    email:'email.example@example.com',
    stats:{
        gamesPlayed:0,
        gamesWon:0,
        gamesSurvived:0,
        gamesAbandoned:0,
    }
}

function LoginComponent({appUser, setAppUser}: { appUser:AppUser|undefined, setAppUser:React.Dispatch<React.SetStateAction<AppUser|undefined>>}) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const [email, setEmail] = useState('')

    const [mode, setMode] = useState('login')

    // uses the input credentials to attempt login, endpoint returns either appUser or undefined.
    const handleClickLogin = () => {
        if(mode=='login'){
            setAppUser(exampleUser)
            resetFields()
        }

        else if (mode=='register'){
            resetFields()
            setMode('login')
        }
    }

    // uses the input credentials to attempt registration, endpoint returns appUser object for newlyCreatedUser, or undefined (unable to create)
    const handleClickRegister = () => {

        if(mode=='register'){

            const skipValidation = true

            const newUser:AppUser = {
                username: username,
                password: password,
                email: email,
                stats: {
                    gamesPlayed:0,
                    gamesWon:0,
                    gamesSurvived:0,
                    gamesAbandoned:0
                }
            }

            const usernameIsValid = ():boolean => {
                return username.length >= 6
            }

            const emailIsValid = ():boolean => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            const passwordIsValid = ():boolean => {
                return (password == passwordAgain)
            }

            const userIsValid = ():boolean => {
                for(const value of Object.values(newUser)){
                    if(!value){
                        return false
                    }
                }
                return true
            }

            if(skipValidation || (emailIsValid() && passwordIsValid() && userIsValid() && usernameIsValid())){
                register(newUser).then((user:AppUser|void) => {
                    if(user){
                        setAppUser(user)
                    }
                })
                resetFields()
            } else {
                if(!usernameIsValid()) {alert('username must be 6 characters or longer')}
                if(!emailIsValid()) {alert('email is not valid')}
                if(!passwordIsValid()) {alert('passwords must match.')}
                if(!userIsValid()) {alert('all fields must be filled')}
            }
        }

        else if (mode=='login'){
            resetFields()
            setMode('register')
        }

    }

    const resetFields = () => {
        setUsername('')
        setPassword('')
        setPasswordAgain('')
        setEmail('')
    }

    const handleUsernameChange = (event:ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event:ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handlePasswordAgainChange = (event:ChangeEvent<HTMLInputElement>) => {
        setPasswordAgain(event.target.value)
    }

    const handleEmailChange = (event:ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    // only render if isVisible is true.
    return (appUser === undefined) ?
        <>
            {(mode == 'login') ?
                <Form
                    style={{display: 'block', margin: 'auto', width: 'auto'}}>
                    <Form.Control
                        placeholder={'Username'}
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <br/>
                    <Form.Control
                        placeholder={'Password'}
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </Form>
                : <></>}

            {(mode=='register') ?
            <Form
                style={{display: 'block', margin:'auto', width:'auto'}}>
                <Form.Control
                    placeholder={'Choose a username'}
                    value={username}
                    onChange={handleUsernameChange}
                />
                <br/>
                <Form.Control
                    placeholder={'Choose a password'}
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                />

                <br/>
                <Form.Control
                    placeholder={'Confirm password'}
                    type="password"
                    value={passwordAgain}
                    onChange={handlePasswordAgainChange}
                />

                <br/>
                <Form.Control
                    placeholder={'Email address'}
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                />

            </Form>
                : <></>
            }

            {/*Buttons*/}
            <div>
                <Button
                    style={{margin:'auto', width:'auto'}}
                    variant="dark"
                    children={'Login'}
                    onClick={handleClickLogin}
                />
                <Button
                    style={{margin:'auto', width:'auto'}}
                    variant="dark"
                    children={'Register'}
                    onClick={handleClickRegister}
                />
            </div>
        </> :
        <></>
}

export default LoginComponent;
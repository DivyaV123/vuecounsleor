
import { defineStore, acceptHMRUpdate } from 'pinia'
import { themeStore } from "../stores/theme"
import Cookies from 'js-cookie'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
export const sessionStore = defineStore('user', {
    state: () => ({
        /* User */
        user: null,
        token: null,
        loggedIn: false,
        author: null,
        send_mail:[],
        verify_otp:[],
        new_pass:[],
        change_pass:[],
        error:""

    }),
    actions: {

        async login(data) {
            const theme = themeStore();
            try {
                const response = await axios.post("https://gotest.qspiders.com/api/user/login", data,
                    {
                        headers: {
                            "content-type": "application/json",
                        }
                    })
                if (response.status === 200) {
                    if(response && response.data && response.data.token){
                        var decoded = jwtDecode(response.data.token)
                        const roles = decoded.roles
                       let counselor=false
                        const result = roles.some(element => {
                            if (element.name === "counselor" || element.name === "hr") {
                                Cookies.set('user', response.data.token,{ expires: 365 },{ domain: '.qspiders.com' })
                                //set { domain: '.qspiders.com' } on launch
                                this.$patch({
                                    user: decoded,
                                    author: { id:decoded.uid, name:decoded.username, roles:decoded.roles, branches:decoded.branches },
                                    token: response.data.token,
                                    loggedIn: true
                                })
                                counselor=true
                                theme.pushMessage("Login Successful")
                            }
                          
                            // else {
                            //     theme.pushMessage("Unauthorized")
                            // }
                        })
                        if(counselor==false){
                            theme.pushMessage("Unauthorized login, please login in proper URL");
                          }
                            // localStorage.setItem("user", JSON.stringify(response.data));
                          }
                          else{
                            theme.pushMessage(response.data.error)
                          }
                    }
                    else {
                        theme.pushMessage("Login failed, please check your username and password")
                      }
                
            }
            catch (error) {
                theme.pushMessage(error.response.data.error)
            }
        },

        async logout() {
            try {
                // Cookies.remove('user', { domain: '.qspiders.com' })
                Cookies.remove('user')
                this.$patch({
                    user: null,
                    token: null,
                    author: null,
                    loggedIn: false,
                })
                return true
            }
            catch (err) {
                return false
            }
        },

        async checkUser() {
            const theme = themeStore();
            if (this.user === null) {
                try{
                    if (Cookies.get('user')) {
                        const token = Cookies.get('user')
                        const decoded = jwtDecode(token)
                        if (decoded && decoded.roles) {
                            const roles = decoded.roles
                            const result = roles.some(element => {
                                if (element.name === "counselor") {
                                    this.$patch({
                                        user: decoded,
                                        author: { id:decoded.uid, name:decoded.username, roles:decoded.roles, branches:decoded.branches },
                                        token: token,
                                        loggedIn: true
                                    })
                                }
                            });
                        }
                        else {
                            theme.pushMessage("You do not have permission to enter this role/domain.")
                        }
                    }
                }catch(err){
                    console.log("check error",err)
                }
              
            }
        },
        async forgotsendemail(data) {
            try{
                const response = await axios.post(` https://gotest.qspiders.com/api/batch/sendmail`,data);
                this.send_mail = response.data
                return this.send_mail
            }
            catch(error){
                this.error =  error.response.data
            }
        },
        async verifyotp(data) {
            try{
                const response = await axios.post(`https://gotest.qspiders.com/api/user/checkotp`,data);
                this.verify_otp = response.data
            }
            catch(error){
                this.error =  error.response.data
            }
        },
        
        async changenew_password(data) {
            try{
                const response = await axios.post(`https://gotest.qspiders.com/api/user/changepasswordafterotp`,data);
                this.new_pass = response.data
            return this.new_pass
            }
            catch(error){
                this.error =  error.response.data
            }
        },

        // async submitChangePassword(form) {
        //     const user = sessionStore();
        //     const theme = themeStore();
        //     if (user.token) {
        //         const headers = {
        //             'Authorization': user.token,
        //             "Content-Type": "application/json",
        //         }
        //         try {
        //             const response = await axios.post('https://gotest.qspiders.com/api/all/change-password', form, { headers }).then(
        //                 function (response) {
        //                     theme.pushMessage(response.data.message)
        //                 }
        //             ).catch(function (error) {
        //                 if (error.response) {
        //                     if (error.response.status === 400) {
        //                         theme.pushMessage(error.response.data.error)
        //                     }
        //                 }
        //                 else if (error.request) { }
        //                 else { }
        //             });
        //         }
        //         catch (err) {
        //             return { message: 'Error has occured', error: err };
        //         }
        //     }
        // },
        async submitChangePassword(data) {
            const user = sessionStore();
            const token = user.token;
           
            if (token) {
                    const headers = {
                        'Authorization': ` ${token}`
                    }
                  try {
                  const response1 = await
                  axios.post(` https://gotest.qspiders.com/api/all/change-password`,data,{
                    headers: headers
                  });
              return this.change_pass = response1.data
        
              }
              catch (err) {
                this.error  = err 
              }
            }
          
          },
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(sessionStore, import.meta.hot))
}
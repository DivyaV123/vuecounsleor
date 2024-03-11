import { defineStore,acceptHMRUpdate } from 'pinia';
import axios from 'axios';
import { sessionStore } from '../stores/session'

export const followupstore = defineStore ('follow_up',{
    state:()=>({
        totalcalled:[],
        notcalled:[],
        students:[],
        coming:[],
        notinterested:[],
        nextbatch:[],
        callback:[],
        notcalled_total:0,
        totalcalled_total:0,
        students_total:0,
        coming_total:0,
        notinterested_total:0,
        nextbatch_total:0,
        callback_total:0,
        help_req:[],
        started:[],
        started_total:0,
        counselor:[],
        accept:[],
        share_data:[],
        remove_reason:[],
        remove_enquiry:[],
        share_couns:[],
        not_joined:[],
        joined:[],
        joined_total:0,
        not_joined_total:0,
        other_joined:[],
        other_joined_total:0
   
       
    }),
    
    actions: {
    async removeError(){
        this.error = ""
        },  
  
        async getFollowup(page=0,search) {
          const user = sessionStore();
          const token = user.token;
         
          if (token) {
                  const headers = {
                      'Authorization': ` ${token}`
                  }
                try {
                const response1 = await
                axios.get(`https://gotest.qspiders.com/api/batch/followup-started?page=${page}&${search}`,{
                  headers: headers
                });
              this.started = response1.data.items
              this.started_total = response1.data.total
      
            }
            catch (err) {
              console.log("err", err.response1)    
            }
          }
        
        },
//   async changepassword(data) {
//     console.log("data",data)
//     const user = sessionStore();
//     const token = user.token;
   
//     if (token) {
//             const headers = {
//                 'Authorization': ` ${token}`
//             }
//           try {
//           const response1 = await
//           axios.post(` https://gotest.qspiders.com/api/admin/change-userpassword`,data,{
//             headers: headers
//           });
//         this.change_pass = response1.data
//         console.log("this.remove_enquiry",this.change_pass)
//       }
//       catch (err) {
//         console.log("err", err.response1)    
//       }
//     }
  
//   },
 // Followup
 async gettotalcalled(page,data,search) {   
    const user = sessionStore();
    const token = user.token;
     if (token) {
        const headers = {
         'Authorization': ` ${token}`
             }
    try {
    const response1 = await 
     axios.get(`https://gotest.qspiders.com/api/batch/called-followups?bpid=${data}&${search}`,{
          headers: headers
     }); 
     this.totalcalled = response1.data.items
     this.totalcalled_total=response1.data.total
    }
    catch (err) {
         console.log("err", err)    
      }
     }
  },
    async getnotcalled(page=0,data,search) {
        const user = sessionStore();
        const token = user.token;
         if (token) {
            const headers = {
             'Authorization': ` ${token}`
                 }
        try {
        const response2 = await
         axios.get(`https://gotest.qspiders.com/api/batch/notcalled-followups?page=${page}&bpid=${data}&${search}`,{
              headers: headers
         }); 

         this.notcalled = response2.data.items
         this.notcalled_total=response2.data.total
    
        }
        catch (err) {
             console.log("err", err)    
        }
      }
   },
   async getstudents(page=0,data,search) {
    const user = sessionStore();
    const token = user.token;
     if (token) {
        const headers = {
         'Authorization': ` ${token}`
             }
    try {
    const response2 = await
     axios.get(`https://gotest.qspiders.com/api/batch/totalstudents-followups?page=${page}&bpid=${data}&${search}`,{
          headers: headers
     }); 
     this.students = response2.data.items
     this.students_total=response2.data.total

    }
    catch (err) {
         console.log("err", err)    
    }
  }
},
async getcoming(page=0,data,search) {
    const user = sessionStore();
    const token = user.token;
     if (token) {
        const headers = {
         'Authorization': ` ${token}`
             }
    try {
    const response3 = await
     axios.get(`https://gotest.qspiders.com/api/batch/commingstudents-followups?page=${page}&bpid=${data}&${search}`,{
          headers: headers
     }); 
     this.coming = response3.data.items
     this.coming_total=response3.data.total

    }
    catch (err) {
         console.log("err", err)    
    }
  }
},
async getnotinterested(page=0,data,search) {
    const user = sessionStore();
    const token = user.token;
     if (token) {
        const headers = {
         'Authorization': ` ${token}`
             }
    try {
    const response4 = await
     axios.get(`https://gotest.qspiders.com/api/batch/notintrested-followups?page=${page}&bpid=${data}&${search}`,{
          headers: headers
     }); 
     this.notinterested = response4.data.items
     this.notinterested_total=response4.data.total

    }
    catch (err) {
         console.log("err", err)    
    }
  }
},
async getnextbatch(page=0,data,search) {
     const user = sessionStore();
     const token = user.token;
      if (token) {
         const headers = {
          'Authorization': ` ${token}`
              }
     try {
     const response4 = await
      axios.get(`https://gotest.qspiders.com/api/batch/nextbatch-followups?page=${page}&bpid=${data}&${search}`,{
           headers: headers
      }); 
      this.nextbatch = response4.data.items
      this.nextbatch_total=response4.data.total
 
     }
     catch (err) {
          console.log("err", err)    
     }
   }
 },
 async getcallback(page=0,data,search) {
     const user = sessionStore();
     const token = user.token;
      if (token) {
         const headers = {
          'Authorization': ` ${token}`
              }
     try {
     const response4 = await
      axios.get(` https://gotest.qspiders.com/api/batch/callback-followups?page=${page}&bpid=${data}&${search}`,{
           headers: headers
      }); 
      this.callback = response4.data.items
      this.callback_total=response4.data.total
 
     }
     catch (err) {
          console.log("err", err)    
     }
   }
 },
 async gethelprequest(data) {
     const user = sessionStore();
     const token = user.token;
      if (token) {
         const headers = {
          'Authorization': ` ${token}`
              }
     try {
     const response = await
      axios.get(`https://gotest.qspiders.com/api/batch/hrfoc-enquiries?bpid=${data}`,{
           headers: headers
      }); 
      this.help_req = response.data
     //  this.callback_total=response4.data.total
 
     }
     catch (err) {
          console.log("err", err)    
     }
   }
 },
 async getcounselor(search) {
     const user = sessionStore();
     const token = user.token;
    
     if (token) {
             const headers = {
                 'Authorization': ` ${token}`
             }
           try {
           const response1 = await
           axios.get(`https://gotest.qspiders.com/api/batch/get-active-counslors?bid=${search}`,{
             headers: headers
           });
         this.counselor = response1.data
       }
       catch (err) {
         console.log("err", err.response1)    
       }
     }
   
   },
   async acceptrequest(data) {
     const user = sessionStore();
     const token = user.token;
    
     if (token) {
             const headers = {
                 'Authorization': ` ${token}`
             }
           try {
           const response1 = await
           axios.post(`https://gotest.qspiders.com/api/batch/hrfoc-assign-enquiries`,data,{
             headers: headers
           });
         this.accept = response1.data
       }
       catch (err) {
         console.log("err", err.response1)    
       }
     }
   
   },
   async sharedata(data) {
     const user = sessionStore();
     const token = user.token;
    
     if (token) {
             const headers = {
                 'Authorization': ` ${token}`
             }
           try {
           const response1 = await
           axios.post(` https://gotest.qspiders.com/api/batch/share-enquiries`,data,{
             headers: headers
           });
       return  this.share_data = response1.data
    
       }
       catch (err) {
         console.log("err", err.response1)    
       }
     }
   
   },
   async getremovereason(search) {
    const user = sessionStore();
    const token = user.token;
   
    if (token) {
            const headers = {
                'Authorization': ` ${token}`
            }
          try {
          const response1 = await
          axios.get(` https://gotest.qspiders.com/api/batch/get-reasons?size=500`,{
            headers: headers
          });
        this.remove_reason = response1.data.items
      }
      catch (err) {
        console.log("err", err.response1)    
      }
    }
  
  },
  async removeenquiry(data) {
    const user = sessionStore();
    const token = user.token;
   
    if (token) {
            const headers = {
                'Authorization': ` ${token}`
            }
          try {
          const response1 = await
          axios.post(`  https://gotest.qspiders.com/api/counselor/remove-enquiry`,data,{
            headers: headers
          });
        this.remove_enquiry = response1.data
      }
      catch (err) {
        console.log("err", err.response1)    
      }
    }
  
  },
  async getsharecounselor(search) {
    const user = sessionStore();
    const token = user.token;
   
    if (token) {
            const headers = {
                'Authorization': ` ${token}`
            }
          try {
          const response1 = await
          axios.get(`https://gotest.qspiders.com/api/batch/get-all-cons-of-branch?bid=${search}`,{
            headers: headers
          });
        this.share_couns = response1.data
      }
      catch (err) {
        console.log("err", err.response1)    
      }
    }
  
  },
  async getjoined(page=0,bid,search) {
    const user = sessionStore();
    const token = user.token;
   
    if (token) {
            const headers = {
                'Authorization': ` ${token}`
            }
          try {
          const response1 = await
          axios.get(`https://gotest.qspiders.com/api/batch/joined-enquires?page=${page}&bpid=${bid}&${search}`,{
            headers: headers
          });
        this.joined = response1.data.items
        this.joined_total =response1.data.total
      }
      catch (err) {
        console.log("err", err.response1)    
      }
    }
  
  },
  async getnotjoined(page=0,bid,search) {
    const user = sessionStore();
    const token = user.token;
   
    if (token) {
            const headers = {
                'Authorization': ` ${token}`
            }
          try {
          const response1 = await
        axios.get(`https://gotest.qspiders.com/api/batch/notjoined-enquiries?page=${page}&bpid=${bid}&${search}`,{
            headers: headers
          });
        this.not_joined = response1.data.items
        this.not_joined_total =response1.data.total
      }
      catch (err) {
        console.log("err", err.response1)    
      }
    }
  
  },
  async getotherjoined(page=0,bid,search) {
    const user = sessionStore();
    const token = user.token;
   
    if (token) {
            const headers = {
                'Authorization': ` ${token}`
            }
          try {
          const response1 = await
        axios.get(`https://gotest.qspiders.com/api/batch/joined-otherstatus-enquires?page=${page}&bpid=${bid}&${search}`,{
            headers: headers
          });
        this.other_joined = response1.data.items
        this.other_joined_total =response1.data.total
      }
      catch (err) {
        console.log("err", err.response1)    
      }
    }
  
  },
 
    }
    })

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(followupstore, import.meta.hot))
}

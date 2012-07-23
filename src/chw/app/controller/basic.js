/**
 * Copyright 2012, Raxa
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
Ext.define('chw.controller.basic', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            "button[action=addButton]": {
                tap: function () {
                    this.doToolbar('add')
                }
            },
            "button[action=cancelButton]": {
                tap: function () {
                    this.doOption(false)
                }
            },
            "button[action=inventoryButton]": {
                tap: function () {
                    this.doToolbar('inventory')
                }
            },
            "button[action=logoutButton]": {
                tap: function () {
                    this.doToolbar('logout')
                }
            },
            "button[action=okButton]": {
                tap: function () {
                    this.doOption(true)
                }
            },
            "button[action=syncButton]": {
                tap: function () {
                    this.doToolbar('sync')
                }
            },
            "button[action=goback]":{
                tap:function(){
                    this.doBack();
                }
            }
            
        }
    },
    launch: function () {
        Ext.create('Ext.Container', {
            id: 'viewPort',
            fullscreen: true,
            layout: 'card',
            activeItem: 0,
            items: [{
                xclass: 'chw.view.loginScreen'
            }, {
                xclass: 'chw.view.familyList'
            }, {
                xclass: 'chw.view.diseaseList'
            }, {
                xclass: 'chw.view.familyDetails'
            }, {
                xclass: 'chw.view.patientDetails'
            }, {
                xclass: 'chw.view.visitDetails'
            }, {
                xclass: 'chw.view.inventoryList'
            }, {
                xclass: 'chw.view.inventoryDetails'
            }, {
                xclass: 'chw.view.addOptions'
            }, {
                xclass: 'chw.view.addFamily'
            }, {
                xclass: 'chw.view.addPatient'
            }]
        })
    },
    doAdd: function(step,arg){
        if(arg){
            if(step==='family'){
                //add family
                var name = Ext.getCmp('familyName').getValue();
                var address = Ext.getCmp('address').getValue();
                var description = Ext.getCmp('description').getValue();
                
                if(familyName=='' || address==''){
                    Ext.Msg.alert("Error", "Please fill in all fields");
                }else{
                    var familyStore = Ext.getStore('families');
                    if(!familyStore){
                        familyStore = Ext.create('chw.store.families');
                    }
                    var count = familyStore.getCount();
                    count = count+1;
                    var familyModel = Ext.create('chw.model.family',{
                        familyName: name,
                        familyAddress: address,
                        familyDescrip: description,
                        familyId: count,
                        familyLatitude: 25,
                        familyLongitude: 25,
                        familyImage: 'resources/home.png',
                        familyDistance: 20
                    });
                    
                    familyStore.add(familyModel);
                    familyStore.sync();
                    //                    familyStore.on('write',function(){
                    console.log('Added family locally');
                    Ext.getCmp('familyName').reset();
                    Ext.getCmp('address').reset();
                    Ext.getCmp('description').reset();
                    Ext.getCmp('viewPort').setActiveItem(PAGES.familyList);
                //                    })
                }
            }else if(step==='patient'){
            //add patient
            }
        }
    },
    doBack: function () {
        // TODO: why doesn't the list refresh when using back button?
        this.doList('familyList');
        Ext.getCmp('viewPort').setActiveItem(PAGES.familyList)
    },
    doExit: function () {
        USER.name = '';
        USER.uuid = '';
        Ext.getCmp('viewPort').setActiveItem(PAGES.loginScreen)
    },
    doLogin: function (arg) {
        if (arg) {
            // fetch and store items
            USER.name = Ext.ComponentQuery.query('LoginScreen #usernameIID')[1].getValue();
            var pass = Ext.ComponentQuery.query('LoginScreen #passwordIID')[1].getValue(); 
            if (USER.name===''||pass==='') {
                Ext.Msg.alert("Error","Please fill in all fields.")
            } else {
                // get user information
                Ext.Ajax.request({
                    scope: this,
                    withCredentials: true,
                    useDefaultXhrHeader: false,
                    url: MRSHOST + '/ws/rest/v1/user?q=' + USER.name,
                    method: 'GET',
                    headers: HEADERS,
                    success: function (resp) {
                        var userInfo = Ext.decode(resp.responseText);
                        if (userInfo.results.length!==0) {
                            Ext.Ajax.request({
                                scope: this,
                                url: userInfo.results[0].links[0].uri + '?v=full',
                                method: 'GET',
                                withCredentials: true,
                                useDefaultXhrHeader: false,
                                headers: HEADERS,
                                success: function (resp) {
                                    var userInf = Ext.decode(resp.responseText);
                                    localStorage.setItem('uuid',userInf.person.uuid)
                                },
                                failure: function () {}
                            })
                            USER.uuid = localStorage.getItem('uuid')
                        } else {}
                    },
                    failure: function () {}
                })
                // save basic auth header
                // delete existing logged in sessions
                Ext.Ajax.request({
                    url: MRSHOST + '/ws/rest/v1/session',
                    withCredentials: true,
                    useDefaultXhrHeader: false,
                    method: 'DELETE',
                    success: function () {}
                })
                // check login and save to localStorage if valid
                Ext.Ajax.request({
                    scope:this,
                    url: MRSHOST + '/ws/rest/v1/session',
                    withCredentials: true,
                    useDefaultXhrHeader: false,
                    headers: {
                        "Accept": "application/json",
                        "Authorization": "Basic " + window.btoa(USER.name + ":" + pass)
                    },
                    success: function (response) {
                        CONNECTED = true;
                        var authenticated = Ext.decode(response.responseText).authenticated;
                        if (authenticated) {
                            localStorage.setItem("basicAuthHeader", "Basic " + window.btoa(USER.name + ":" + pass));
                            Ext.ComponentQuery.query('LoginScreen #usernameIID')[1].reset();
                            Ext.ComponentQuery.query('LoginScreen #passwordIID')[1].reset();
                            this.doList('familyList');
                            Ext.getCmp('viewPort').setActiveItem(PAGES.familyList)
                        } else {
                            localStorage.removeItem("basicAuthHeader");
                            Ext.ComponentQuery.query('LoginScreen #usernameIID')[1].reset();
                            Ext.ComponentQuery.query('LoginScreen #passwordIID')[1].reset();
                            Ext.Msg.alert("Error", "Please try again")
                        }
                    },
                    failure: function () {
                        CONNECTED = false;
                        // hash user/pass
                        var hashPass = 'Basic ' + window.btoa(USER.name + ":" + pass);
                        var hashStored = localStorage.getItem('basicAuthHeader');
                        // compare hashPass to hashStored
                        if (hashPass === hashStored) {
                            Ext.ComponentQuery.query('LoginScreen #usernameIID')[1].reset();
                            Ext.ComponentQuery.query('LoginScreen #passwordIID')[1].reset();
                            this.doList('familyList');
                            Ext.getCmp('viewPort').setActiveItem(PAGES.familyList)
                        } else {
                            Ext.ComponentQuery.query('LoginScreen #usernameIID')[1].reset();
                            Ext.ComponentQuery.query('LoginScreen #passwordIID')[1].reset();
                            Ext.Msg.alert("Error", "Please try again")
                        }
                    }
                })
            }
        } else {
            // exit the program
            this.doExit();
        }
    },
    doList: function (arg) {
        if (arg==='familyList') {
            // set up store for list organized by family
            var fstore = Ext.getStore('families');
            if (!fstore) {
                Ext.create('chw.store.families')
            }
            fstore.load();
            Ext.getCmp('familyLists').setStore(fstore)
            // set up store for list organized by illness
            var istore = Ext.getStore('illnesses');
            if (!istore) {
                Ext.create('chw.store.illnesses')
            }
            istore.load();
            Ext.getCmp('illnessNames').setStore(istore)
        }
    },
    doOption: function (arg) {
        if (arg) {
            var active = Ext.getCmp('viewPort').getActiveItem();
            console.log(active.id);
            if (active.getActiveItem()===PAGES.loginScreen) {
                this.doLogin(arg);
            }else if(active.id==='ext-panel-5'){
                this.doAdd('family',arg);
            }
        }
    }, 
    doToolbar: function (arg) {
        if (arg==='add') {
            Ext.getCmp('viewPort').setActiveItem(PAGES.addFamily)
        } else if (arg==='sync') {
            Ext.Msg.confirm('','Sync all information?', function (resp) {
                if (resp==='yes') {}
            })
        } else if (arg==='inventory') {
            // TODO: why doesn't the list load?
            var nstore = Ext.getStore('pills')
            if (!nstore) {
                Ext.create('chw.store.pills')
            }
            nstore.load();
            Ext.getCmp('inventoryLists').setStore(nstore)
            console.log(Ext.getCmp('inventoryLists').getStore())
            Ext.getCmp('viewPort').setActiveItem(PAGES.inventoryList)
        } else if (arg==='logout') {
            this.doExit()
        }
    }
})
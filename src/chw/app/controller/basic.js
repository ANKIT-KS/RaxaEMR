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
Ext.define('mUserStories.controller.basic', {
    extend: 'Ext.app.Controller',
    controllers: ['basic'],
    views: ['loginScreen', 'confirmLocation', 'patientList', 'patientDetails', 'vcNotifications', 'vcScheduling'],
    config: {
        refs: {
            addApp: '#add_app',
            addReg: '#add_reg',
            addRem: '#add_rem',
            back: '#backButton',
            cancel: '#cancelButton',
            sync: '#syncButton',
            inbox: '#inboxButton',
            logout: '#logoutButton',
            logout_vc: '#logoutButton_vc',
            menu: '#menuButton',
            narwhal: '#narwhal',
            not_vc: '#notButton',
            ok: '#okButton',
            ok_loc: '#ok_loc',
            resources: '#resourcesButton',
            sch_vc: '#schButton',
            vis_ors: '#vis_ors',
            vis_rdt: '#vis_rdt',
            vis_vita: '#vis_vita',
            vis_alb: '#vis_alb',
            vis_blood: '#vis_blood'
        },
        control: {
            addApp: {
                tap: function () {
                    this.doAdd('app', true)
                }
            },
            addReg: {
                tap: function () {
                    this.doAdd('reg', true)
                }
            },
            addRem: {
                tap: function () {
                    this.doAdd('rem', true)
                }
            },
            back: {
                tap: function () {
                    this.doBack()
                }
            },
            cancel: {
                tap: function () {
                    this.doOption(false)
                }
            },
            sync: {
                tap: function () {
                    this.doToolbar('sync')
                }
            },
            inbox: {
                tap: function () {
                    this.doToolbar('inbox')
                }
            },
            logout: {
                tap: function () {
                    this.doExit()
                }
            },
            logout_vc: {
                tap: function () {
                    this.doExit()
                }
            },
            menu: {
                tap: function () {
                    this.doToolbar('menu')
                }
            },
            not_vc: {
                tap: function () {
                    this.doToolbar('not')
                }
            },
            ok: {
                tap: function () {
                    this.doOption(true)
                }
            },
            ok_loc:{
                tap: function(){
                    this.doLocation(true)
                }  
            },
            photo: {
                tap: function () {
                    this.doResources('photo')
                }
            },
            resources: {
                tap: function () {
                    this.doToolbar('resources')
                }
            },
            sch_vc: {
                tap: function () {
                    this.doToolbar('sch')
                }
            },
            vis_ors: {
                tap: function () {
                    this.doVis('ors')
                }
            },
            vis_rdt: {
                tap: function () {
                    this.doVis('rdt')
                }
            },
            vis_vita: {
                tap: function () {
                    this.doVis('vita')
                }
            },
            vis_alb: {
                tap: function () {
                    this.doVis('alb')
                }
            },
            vis_blood: {
                tap: function () {
                    this.doVis('blood')
                }
            }
        }
    },
    launch: function () {
        Ext.create('Ext.Container', {
            id: 'viewPort',
            fullscreen: true,
            layout: 'card',
            items: [{
                // log into application
                xclass: 'mUserStories.view.loginScreen'
            }, {
                // daily checkin
                xclass: 'mUserStories.view.confirmLocation'
            }, {
                // display a list of patients
                xclass: 'mUserStories.view.patientList'
            }, {
                // display details of patient
                xclass: 'mUserStories.view.patientDetails'
            }, {
                // display options for adding
                xclass: 'mUserStories.view.addOptions'
            }, {
                xclass: 'mUserStories.view.addPatient'
            }, {
                xclass: 'mUserStories.view.addReminder'
            }, {
                xclass: 'mUserStories.view.addAppointment'
            }, {
                // display inbox/outbox
                xclass: 'mUserStories.view.notificationInbox'
            }, {
                xclass: 'mUserStories.view.resources'
            }, {
                xclass: 'mUserStories.view.resourceDetail'
            }, {
                xclass: 'mUserStories.view.vcNotifications'
            }, {
                xclass: 'mUserStories.view.vcScheduling'
            }]
        })
    },
    /* SCREEN FUNCTIONS */
    // add registrations and reminders
    // TODO: should we add more functionality? ex. place order for sample
    doAdd: function (step, arg) {
        if (arg) {
            if (step === 'app') {
                this.toPage(PAGES.ADD_APP)
            } else if (step === 'reg') {
                this.toPage(PAGES.ADD_REG)
            } else if (step === 'rem') {
                this.toPage(PAGES.ADD_REM)
            } else if (step === 'register') {
                var fname = Ext.getCmp('first_reg').getValue();
                var lname = Ext.getCmp('last_reg').getValue();
                var phone = Ext.getCmp('phone_reg').getValue();
                var village = Ext.getCmp('village_reg').getValue();
                var radioform = Ext.getCmp('ext-formpanel-5').saveForm();
                var gender = radioform.radiogroup.charAt(0);
                var bday = Ext.getCmp('bday').getValue();

                if (fname == '' || lname == '' || phone == '' || village == '' || gender == '' || bday == '') {
                    Ext.Msg.alert("Error", "Please fill in all fields")
                } else {
                    
                    var offlineStore = Ext.getStore('offlineRegisterStore');
                    if(!offlineStore){
                        offlineStore = Ext.create('mUserStories.store.offlineRegisterStore')
                    }
                   
                    var up_Model = Ext.create('mUserStories.model.upPersonModel',{
                        names: [{
                            givenName: fname,
                            familyName: lname
                        }],
                        gender: gender,
                        birthdate: bday,
                        addresses: [{
                            cityVillage: village
                        }]
                    });
                    
                    offlineStore.add(up_Model);
                    offlineStore.sync();
                    
                    console.log('stored offline');
                    
                    Ext.getCmp('ext-formpanel-5').reset();
                    this.doDownload();
                    Ext.getCmp('viewPort').setActiveItem(PAGES.PATIENT_LIST)    
                }
            } else if (step === 'reminder') {
            // TODO: validate all fields
            // TODO: add 'other' option
            }
        } else {
            // TODO: doReturn()
            this.doDownload();
            this.toPage(PAGES.PATIENT_LIST)
        }
    },
    // allow chw to check in
    doLocation: function (arg) {
        if (arg) {
            // TODO: generate close locations based on USER
            LOCATION = Ext.getCmp('location').getValue();
            if (LOCATION === 'empty') {
                Ext.Msg.alert("", 'Please fill in the form')
            } else {
                if (LOCATION === "otherlocation") {
                    Ext.Msg.prompt("", "Please enter other location:", function (btn, text) {
                        if (btn === 'ok') {
                            LOCATION = text;
                        }
                    })
                }
                // TODO: pass LOCATION & CURR_DATE to manager
                // download all data into local storage
                this.doDownload();
                // continue to the next screen
                this.toPage(PAGES.PATIENT_LIST)
            }
        } else {
            // exit the program
            this.doExit();
        }
    },
    // login to the application
    doLogin: function (arg) {
        if (arg) {
            // store items
            USER.name = Ext.getCmp('username').getValue();
            var pass = Ext.getCmp('password').getValue();
            if (USER.name === '' || pass === '') {
                Ext.Msg.alert("Error", "Please fill in all fields")
            } else {
                this.getUserInformation(USER.name);
                this.saveBasicAuthHeader(USER.name,pass);
            }
        } else {
            // exit the program
            this.doExit();
        }
    },
    // manage resources pages
    doResources: function (arg) {
        if (arg === 'video') {
            this.toPage(PAGES.VIDEO)
        } else if (arg === 'audio') {
            this.toPage(PAGES.AUDIO)
        } else if (arg === 'photo') {
            this.toPage(PAGES.PHOTO)
        }
    },
    
    // manage navigation based on lower toolbar
    doToolbar: function (arg) {
        if (arg === 'menu') {
            this.toPage(PAGES.ADD)
        } else if (arg === 'sync') {
            Ext.Msg.confirm('', 'Sync all information?', function (resp) {
                if (resp === 'yes') {
                    // TODO: check for conflicts             
                    // doUpload all information
                    
                    var onlineStore = Ext.create('mUserStories.store.upPersonStore');
                    var offlineStore = Ext.getStore('offlineRegisterStore')
                    onlineStore.on('write',function(){
                        console.log('Syncing');
                        this.getidentifierstype(onlineStore.getAt(0).getData().uuid)
                        offlineStore.removeAll();
                        offlineStore.sync();
                    },this);
                    
                    offlineStore.each(function(record){
                        record.phantom = true;
                        onlineStore.add(record);
                        
                        console.log(offlineStore.getNewRecords());
                        console.log(offlineStore.getUpdatedRecords());
                        console.log(offlineStore.getRemovedRecords());
                        
                        onlineStore.sync();
                        
                    },this);
                    this.doDownload();
                    Ext.getCmp('patientlistid').reset();
                }
            },this)
        } else if (arg === 'inbox') {
            this.toPage(PAGES.INBOX_CHW)
        } else if (arg === 'resources') {
            this.getResources();
            this.toPage(PAGES.RESOURCES)
        } else if (arg === 'not') {
            this.toPage(PAGES.INBOX_VC)
        } else if (arg === 'sch') {
            this.toPage(PAGES.SCHEDULING)
        }
    },
    doVis: function (arg) {
        var reading = '';
        var title = '';
        var detail = '';
        if (arg === 'ors') {
            title = 'ORS';
            detail = 'Adminster Oral Rehydration Salts'
        } else if (arg === 'rdt') {
            title = 'RDT';
            detail = 'Adminster Rapid Diagnostic Test for malaria'
        } else if (arg === 'vita') {
            title = 'Vitamin A';
            detail = 'Check if Vitamin A has been administered.'
        } else if (arg === 'alb') {
            title = 'Albendazole';
            detail = 'Check if Albendazole has been administered'
        } else if (arg === 'blood') {
            title = 'Blood sample';
            detail = 'Take a bloodsample for CBC'
        }
        // TODO: play recording
        Ext.getCmp('ping').play();
        // confirm completion
        Ext.Msg.confirm('Task', detail, function (resp) {
            if (resp === 'yes') {
                // TODO: record that the task has been completed
                // change button to demonstrate this
                Ext.getCmp('vis_'+arg).setUi('decline');
                Ext.getCmp('vis_'+arg).setDisabled(true)
            }
        })
    // TODO: when all buttons are clicked, notify of completion
    },
    /* HELPER FUNCTIONS */
    // deal with backbutton
    doBack: function () {
        var active = Ext.getCmp('viewPort').getActiveItem();
        if (active.id === 'ext-formpanel-5' || active === 'ext-panel-6' || active === 'ext-panel-7') {
            this.toPage(PAGES.ADD)
        } else {
            this.toPage(PAGES.PATIENT_LIST)
        }
    /*/ TODO: Best logic for returning to previous page - doReturn()
        // Hard coded in? Create a list of visited pages?
        if (arg === 'list') {
            this.doDownload();
            Ext.getCmp('viewPort').setActiveItem(PAGES.PATIENT_LIST)
        } else if (arg === 'add') {
            Ext.getCmp('viewPort').setActiveItem(PAGES.ADD)
        } else if (arg === 'res') {
            this.getResources();
            Ext.getCmp('viewPort').setActiveItem(PAGES.RESOURCES)
        }*/
    },
    // Download patient with details
    doDownload: function () {
        //Initially assuming we are connected
        CONNECTED = true;
        
        //Get the download store. If it doesnt exist, then create one
        var down_store=Ext.getStore('downStore');
        if(!down_store){
            down_store = Ext.create('mUserStories.store.downStore');
            console.log('created down store');
        }
        
        //Similarly get the offline store. Create if it doesnt exist.
        var offlineStore=Ext.getStore('offlineStore');
        if(!offlineStore){
            offlineStore = Ext.create('mUserStories.store.offlineStore');
            console.log('created offline store');
        }

        //Make the download store attempt to fetch values from the web. See downStore.js
        down_store.load();
        down_store.on('load',function(){
            // So if the exception was raised (in downStore.js), the list would at this point be populated with offline data.
            // If the exception was not raised, and hence CONNECTED=1, then we proceed to fill the offline store with new values
            if(CONNECTED){
                //Before updating the offline store, clean it up
                offlineStore.removeAll();
                //Fill offline store
                down_store.each(function (record){
                    offlineStore.add(record);
                    offlineStore.sync();
                });
                //At this point, when we do have connectivity, borh our stores- the offline and online stores will have the same value. 
                // So you can populate the list with either stores. This is the end of the scenario when we do have connectivity.
                Ext.getCmp('patientlistid').setStore(offlineStore);
            }
        },this)
        
       
        
    // TODO: set patientcurrid to be subset of above organized by appt time
    // Do we need a separate store for this?
    },
    // exit the program
    doExit: function () {
        // TODO: make sure all information is uploaded
        // TODO: delete/save necessary information
        // Ext.getCmp('location').reset();
        // return to login screen
        USER.name = '';
        USER.uuid = '';
        this.toPage(PAGES.LOGIN_SCREEN)
    },
    // distinguish between ok and cancel
    doOption: function (arg) {
        var active = Ext.getCmp('viewPort').getActiveItem();
        if (active.getActiveItem() === PAGES.LOGIN_SCREEN) {
            this.doLogin(arg)
        } else if (active.id === 'ext-formpanel-5') {
            this.doAdd('register',arg)
        } else if (active === 'ext-panel-6') {
            this.doAdd('reminder',arg)
        } else if (active === 'ext-panel-7') {
            this.doAdd('appointment',arg)
        } else if (active === 'ext-tabpanel-3') {
            
        } else if (active === PAGES.INBOX_VC) {
            
        }
    },
    /* this funtions makes a get call to get the patient identifiers type */
    getidentifierstype: function (personUuid) {
        var identifiers = Ext.create('mUserStories.store.identifiersType')
        identifiers.load();
        console.log('Identifiers loaded');
        // This statement calls getlocation() as soon as the get call is successful
        identifiers.on('load', function () {
            console.log('Getting location');
            //Once the identifiers are loaded, fetch location parameters
            this.getlocation(personUuid, identifiers.getAt(0).getData().uuid)
        }, this);
    },
    /* this funtions makes a get call to get the location uuid */
    getlocation: function (personUuid, identifierType) {
        var locations = Ext.create('mUserStories.store.location')
        locations.load();
        console.log('locations loaded');
        // Now that we have both, identifiers type and location we can create a Patient
        locations.on('load', function () {
            console.log('Sending request to create patient');
            this.makePatient(personUuid, identifierType, locations.getAt(0).getData().uuid)
        }, this)
    },
    getPatientIdentifier: function () {
        //dummy funtion to be used for creating partient
        // TODO: writen a  ramdom no for patient identufier but it should be a unique id
        return Math.floor(Math.random() * 1000000000);
    },
    getResources : function () {
        var resource_store = Ext.getStore('resourceStore');
        resource_store.load();
        Ext.getCmp('resourceList').setStore(resource_store)
    },
    getUserInformation: function (username) {
        Ext.Ajax.request({
            scope: this,
            withCredentials: true,
            useDefaultXhrHeader: false,
            url: MRSHOST + '/ws/rest/v1/user?q=' + username,
            method: 'GET',
            headers: HEADERS,
            success: this.storeUserInformation,
            failure: function () {}
        });
    },
    isEmpty: function (arg) {
    // TODO: check to see if the select field is empty
    // TODO: continue to arg if not empty
    },
    isOther: function (arg) {
    // TODO: check to see if the select field is other
    // TODO: pop up screen prompt
    // TODO: continue to arg 
    },
    loginContinue: function () {
        // clear form fields
        Ext.getCmp('username').reset();
        Ext.getCmp('password').reset();
        if (USER.type === 'CHW') {
            // continue to next page with proper settings
            // Ext.getCmp('welcome_label').setHtml("Welcome, "+USER.name+"<br>"+"This is your check in for "+CURR_DATE)
            this.doDownload();
            this.toPage(PAGES.LOCATION);
        // Ext.getCmp('viewPort').setActiveItem(PAGES.PATIENT_LIST);
        // Ext.getCmp('viewPort').setActiveItem(PAGES.PATIENT_LIST)
        } else if (USER.type === 'VC') {
            this.toPage(PAGES.INBOX_VC)
        }
    },
    /* this funtions makes a post call to create the patient with three parameter which will sent as person, identifiertype 
       and loaction */
    makePatient: function (personUuid, identifierType, location) {
        var patient = Ext.create('mUserStories.model.upPatientModel', {
            person: personUuid,
            identifiers: [{
                identifier: this.getPatientIdentifier().toString(),
                identifierType: identifierType,
                location: location,
                preferred: true
            }]
        });

        var PatientStore = Ext.create('mUserStories.store.upPatientStore')
        PatientStore.add(patient);
        //makes the post call for creating the patient
        PatientStore.sync();
        PatientStore.on('write', function () {
            console.log('------Patient Created successfully------');
            //After patient has been created, send the encounter data
            this.sendEncounterData(personUuid);
        }, this);
        
        Ext.getCmp('ext-formpanel-5').reset();
        
        this.doDownload();
        this.toPage(PAGES.PATIENT_LIST)
    },
    
    sendEncounterData:function(Uuid){
        
        //Function for getting date in correct format
        function ISODateString(d){
            function pad(n){
                return n<10 ? '0'+n : n
            }
            return d.getUTCFullYear()+'-'
            + pad(d.getUTCMonth()+1)+'-'
            + pad(d.getUTCDate())+'T'
            + pad(d.getUTCHours())+':'
            + pad(d.getUTCMinutes())+':'
            + pad(d.getUTCSeconds())+'Z'
        }
        //Creating the encounter model and hard-coding the encounter type uuid and provider uuid
        var JSONEncounter = Ext.create(mUserStories.model.encounterModel,{
            encounterDatetime: ISODateString(new Date()),
            patient: Uuid,
            encounterType: 'f30845d5-9ec0-4960-8104-a1366db21dc4',
            provider : USER.uuid
        })
        
        //Create the encounter store and POST the encounter
        var store = Ext.create('mUserStories.store.encounterStore');
        store.add(JSONEncounter);
        store.sync();
    },
    saveBasicAuthHeader: function (username, password) {
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
                "Authorization": "Basic " + window.btoa(username + ":" + password)
            },
            success: function (response) {
                CONNECTED = true;
                var authenticated = Ext.decode(response.responseText).authenticated;
                if (authenticated) {
                    localStorage.setItem("basicAuthHeader", "Basic " + window.btoa(username + ":" + password));
                    this.loginContinue();
                } else {
                    localStorage.removeItem("basicAuthHeader");
                    Ext.Msg.alert("Error", "Please try again")
                }
            },
            failure: function (response) {
                CONNECTED = false;
                // hash user/pass
                var hashPass = 'Basic ' + window.btoa(username + ":" + password);
                var hashStored = localStorage.getItem('basicAuthHeader');
                // compare hashPass to hashStored
                if (hashPass === hashStored) {
                    this.loginContinue();
                } else {
                    Ext.Msg.alert("Error", "Please try again")
                }
            }
        })
    }, 
    storeUserInformation: function (userInfo) {
        var userInfoJson = Ext.decode(userInfo.responseText);
        if (userInfoJson.results.length !== 0) {
            Ext.Ajax.request({
                scope: this,
                url: userInfoJson.results[0].links[0].uri + '?v=full',
                method: 'GET',
                withCredentials: true,
                useDefaultXhrHeader: false,
                headers: HEADERS,
                success: function (response) {
                    var userInfo = Ext.decode(response.responseText);
                    USER.uuid = userInfo.person.uuid;
                    console.log(userInfo);
                    localStorage.setItem('uuid', userInfo.person.uuid)
                },
                failure: function () {
                    USER.uuid = localStorage.getItem('uuid')
                }
            });
        } else {}
    },
    toPage : function (arg) {
        var t = Ext.getCmp('narwhal');
        var b = Ext.getCmp('backButton');
        console.log(t,b)
        if (arg === PAGES.LOGIN_SCREEN) {
            t.setTitle('Community Health Worker Module');
            b.setHidden(true)
        } else if (arg === PAGES.PATIENT_LIST) {
            t.setTitle('Patient List');
            b.setHidden(true);
        } else if (arg === PAGES.PATIENT_DET) {
            // title.setTitle('Patient Details');
            b.setHidden(false)
        } else if (arg === PAGES.ADD) {
            t.setTitle('Add Options');
            b.setHidden(false)
        }
        else if (arg === PAGES.ADD_REG) {
            t.setTitle('Add Patient');
            b.setHidden(false)
        }
        else if (arg === PAGES.ADD_REM) {
            t.setTitle('Add Reminder');
            b.setHidden(false)
        }
        else if (arg === PAGES.ADD_APP) {
            t.setTitle('Add Appointment');
            b.setHidden(false)
        }
        else if (arg === PAGES.INBOX_CHW) {
            t.setTitle('Inbox');
            b.setHidden(false)
        }
        else if (arg === PAGES.RESOURCES) {
            t.setTitle('Resources');
            b.setHidden(false)
        }
        else if (arg === PAGES.RESOURCE_DET) {
            // title.setTitle('Patient Details');
            b.setHidden(false)
        }
        else if (arg === PAGES.INBOX_VC) {
            t.setTitle('Inbox');
            b.setHidden(true)
        }
        else if (arg === PAGES.SCHEDULING) {
            t.setTitle('Scheduling');
            b.setHidden(true)
        }
        Ext.getCmp('viewPort').setActiveItem(arg);
    }
})

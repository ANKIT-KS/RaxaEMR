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
Ext.define('chw.store.familyStore', {
    extend: 'Ext.data.Store',
    config: {
        model: 'chw.model.familyModel',
        id: 'familyStore',
        sorters: 'familyDistance',
        /*grouper: function (record) {
            return record.get('familyDistance')[0];
        },*/
        data: [{
            familyName: 'Desai',
            familyLatitude: 25,
            familyLongitude: 25,
            familyImage: 'resoures/home.png',
            // familyMembers: 'chw.store.patientStore',
            familyDistance: 50
        }, {
            familyName: 'Eppanapally',
            familyLatitude: 25,
            familyLongitude: 25,
            familyImage: 'resoures/home.png',
            // familyMembers: 'chw.store.patientStore',
            familyDistance: 20
        }, {
            familyName: 'Patel',
            familyLatitude: 25,
            familyLongitude: 25,
            familyImage: 'resoures/home.png',
            // familyMembers: 'chw.store.patientStore',
            familyDistance: 30
        }, {
            familyName: 'Vaidya',
            familyLatitude: 25,
            familyLongitude: 25,
            familyImage: 'resoures/home.png',
            // familyMembers: 'chw.store.patientStore',
            familyDistance: 40
        }]
    }
})
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
Ext.define('chw.store.patientStore', {
    extend: 'Ext.data.Store',
    config: {
        model: 'chw.model.patientModel',
        id: 'patientStore',
        sorters: 'familyName',
        grouper: function (record) {
            return record.get('familyName')[0];
        },
        data: [{
            firstName: 'Ronak',
            familyName: 'Patel',
            patientAge: 20,
            patientGender: 'Male',
            patientImage: 'resources/user.png'
            // patientIllnesses: ''
        }, {
            firstName: 'Bansi',
            familyName: 'Patel',
            patientAge: 19,
            patientGender: 'Male',
            patientImage: 'resources/user.png'
            // patientIllnesses: ''
        }]
    }
})
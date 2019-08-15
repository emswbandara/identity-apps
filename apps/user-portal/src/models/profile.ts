/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Profile Model
 */
export interface BasicProfileInterface {
    displayName: string;
    emails: string[];
    email: string;
    lastName: string;
    phoneNumbers: number[];
    organisation: string;
    roles: string[];
    proUrl: string;
    isSecurity: boolean;
    nameEdit: boolean;
    mobile: string;
    emailEdit: boolean;
    personalInfoEdit: boolean;
    updateStatus: boolean;
    username: string;
}

export const createEmptyProfile = (): BasicProfileInterface => ({
    displayName: "",
    email: "",
    emailEdit: false,
    emails: [],
    isSecurity: false,
    lastName: "",
    mobile: "",
    nameEdit: false,
    organisation: "",
    personalInfoEdit: false,
    phoneNumbers: [],
    proUrl: "",
    roles: [],
    updateStatus: false,
    username: ""
});

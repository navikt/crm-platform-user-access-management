import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import AccessManagementImages from '@salesforce/resourceUrl/AccessManagementImages';

export default class AccessManagementHome extends NavigationMixin(LightningElement) {

    data = [
        {
            "id": "apply",
            "img": AccessManagementImages + '/apply.png',
            "text": "Søk tilgang",
            "func": this.apply,
            "style": "background-color: #b8ebf9;"
        },
        {
            "id": "access",
            "img": AccessManagementImages + '/access.png',
            "text": "Se tilganger",
            "func": this.access,
            "style": "background-color: #8bd2ad;"
        },
        {
            "id": "applications",
            "img": AccessManagementImages + '/applications.png',
            "text": "Se søknader",
            "func": this.applications,
            "style": "background-color: #ffd290;"
        }
    ];


    apply(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'AccessApplication',
            }
        });
    }

    access(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: this.tabName,
            }
        });
    }

    applications(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: this.tabName,
            }
        });
    }
}
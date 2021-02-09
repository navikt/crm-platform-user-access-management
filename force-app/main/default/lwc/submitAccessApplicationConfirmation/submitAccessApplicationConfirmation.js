import { LightningElement, track, api } from 'lwc';
export default class SubmitAccessApplicationConfirmation extends LightningElement {
    @track isModalOpen;
    @api originalData;
    @api selectedRows;

    @track filteredData;
    @track expandedRows = [];

    columns = [
        {
            type: 'text',
            fieldName: 'name',
            label: 'Name'
        },

        {
            type: 'text',
            fieldName: 'description',
            label: 'Description',
            initialWidth: 400
        }
    ];

    connectedCallback() {
        let tmp = [];

        this.originalData.forEach((record) => {
            if (this.selectedRows.includes(record.id)) {
                tmp.push(record);
                if (record.children && record.children.length > 0) {
                    this.expandedRows.push(record.id);
                }

                // TODO add children
            }
        });

        this.filteredData = [...tmp];
    }

    closeModal() {
        this.isModalOpen = false;
    }

    submitDetails() {
        this.isModalOpen = false;
    }
}

import { LightningElement, track, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getPermissions from '@salesforce/apex/AccessApplicationController.getPermissions';
import { COLUMNS } from './data';
import {
    checkChildren,
    uncheckChildren,
    checkHeader,
    uncheckHeader
} from './check';

export default class SubmitAccessApplication extends LightningElement {
    @track data;
    @track dataObj;
    deWireResult;
    @track columns = COLUMNS;

    @track selectedRows = [];
    @track previouslySelectedRows = [];
    @track expandedRows = [];

    @track error = false;
    @track loading = true;
    @track errorMsg;

    @track canChangeUser = true; // TODO implement check
    @track isButtonDisabled = true;
    @track isModalOpen = false;

    @wire(getPermissions)
    deWire(result) {
        this.deWireResult = result;
        if (result.data) {
            this.dataObj = result.data;
            this.getDataFromResults(result.data);
            this.selectedRows = [...this.selectedRows];
            this.loading = false;
        } else if (result.error) {
            this.error = true;
            this.loading = false;
            this.setError(result.error);
        }
    }

    getDataFromResults(data) {
        let extensibleData = JSON.parse(JSON.stringify(data));

        extensibleData.forEach((record) => {
            if (record.children && record.children.length > 0) {
                record._children = record.children;
            }
        });

        this.data = extensibleData;
    }

    updateSelectedRows() {
        let selectedRows = this.template
            .querySelector('lightning-tree-grid')
            .getSelectedRows();

        let currentlySelectedRows = [];
        let previouslySelectedRows = this.selectedRows;

        // get list of ids, not objects
        selectedRows.forEach((record) => {
            currentlySelectedRows.push(record.id);
        });

        if (currentlySelectedRows.length != previouslySelectedRows.length) {
            this.dataObj.forEach((record) => {
                let recordChecked =
                    currentlySelectedRows.includes(record.id) &&
                    !previouslySelectedRows.includes(record.id);
                let recordUnchecked =
                    !currentlySelectedRows.includes(record.id) &&
                    previouslySelectedRows.includes(record.id);
                let hasChildren = record.children && record.children.length > 0;

                if (hasChildren) {
                    checkChildren(record, currentlySelectedRows, recordChecked);
                    uncheckChildren(
                        record,
                        currentlySelectedRows,
                        recordUnchecked
                    );
                    checkHeader(record, currentlySelectedRows);
                    uncheckHeader(
                        record,
                        currentlySelectedRows,
                        this.expandedRows
                    );
                }
            });

            if (
                this.collapsedRow &&
                !currentlySelectedRows.includes(this.collapsedRow)
            ) {
                currentlySelectedRows.push(this.collapsedRow);
                this.collapsedRow = undefined;
            }

            this.selectedRows = [...currentlySelectedRows];

            // this.expandRows(currentlySelectedRows)
        }
    }

    // expandRows(currentlySelectedRows) {

    //     let currentlyExpandedRows = [];
    // var currentlySelectedRows = this.template.querySelector('lightning-tree-grid').getSelectedRows();

    //     this.dataObj.forEach(record => {
    //         if (currentlySelectedRows.includes(record.id) && record.isParent && !currentlyExpandedRows.includes(record.id)) {
    //             currentlyExpandedRows.push(record.id);
    //         }
    //         if (record.children) {
    //             record.children.forEach(child => {
    //                 if (currentlySelectedRows.includes(child.id) && !currentlyExpandedRows.includes(child.id)) {
    //                     currentlyExpandedRows.push(child.parentId);
    //                 }
    //             });
    //         }
    //         if (record.isChild && !currentlyExpandedRows.includes(record.parentId)) { currentlyExpandedRows.push(record.parentId); }
    //     });

    //     this.expandedRows = [...currentlyExpandedRows];
    // }

    rowToggle(event) {
        if (event.detail.isExpanded && event.detail.hasChildrenContent) {
            this.expandRow(event.detail.row);
        } else if (
            !event.detail.isExpanded &&
            event.detail.hasChildrenContent
        ) {
            this.collapseRow(event.detail.row);
        }

        let expandedRows = this.template
            .querySelector('lightning-tree-grid')
            .getCurrentExpandedRows();
        this.expandedRows = [...expandedRows];
    }

    expandRow(row) {
        if (this.selectedRows.includes(row.id)) {
            let currentlySelectedRows = [];
            let selectedRows = this.template
                .querySelector('lightning-tree-grid')
                .getSelectedRows();
            selectedRows.forEach((record) => {
                currentlySelectedRows.push(record.id);
            });

            checkChildren(row, currentlySelectedRows, true);
            this.selectedRows = [...currentlySelectedRows];
        }
    }

    collapsedRow = undefined;

    collapseRow(row) {
        if (this.selectedRows.includes(row.id)) {
            this.collapsedRow = row.id;
        }

        // TODO save children
    }

    handleClick(event) {
        switch (event.target.name) {
            case 'changeUser':
                break;
            case 'cancel':
                break;
            case 'apply':
                this.isModalOpen = true;
                break;
            default:
                break;
        }
    }

    changeUser() {}

    cancel() {}

    apply() {}

    refreshData() {
        this.error = false;
        this.loading = true;
        return refreshApex(this.deWireResult).then(() => {
            this.loading = false;
        });
    }

    setError(error) {
        if (error.body && error.body.exceptionType && error.body.message) {
            this.errorMsg = `[ ${error.body.exceptionType} ] : ${error.body.message}`;
        } else if (error.body && error.body.message) {
            this.errorMsg = `${error.body.message}`;
        } else if (typeof error === String) {
            this.errorMsg = error;
        } else {
            this.errorMsg = JSON.stringify(error);
        }
    }
}

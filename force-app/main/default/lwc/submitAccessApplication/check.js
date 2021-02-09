export { checkChildren, uncheckChildren, checkHeader, uncheckHeader };

// check children if header checked
const checkChildren = (record, currentlySelectedRows, recordChecked) => {
    if (recordChecked) {
        record.children.forEach((child) => {
            if (!currentlySelectedRows.includes(child.id)) {
                currentlySelectedRows.push(child.id);
            }
        });
    }
};

// uncheck children if header unchecked
const uncheckChildren = (record, currentlySelectedRows, recordUnchecked) => {
    if (recordUnchecked) {
        record.children.forEach((child) => {
            remove(child.id, currentlySelectedRows);
        });
    }
};

// check header if all children are checked
const checkHeader = (record, currentlySelectedRows) => {
    let allSelected = areAllChildrenSelected(record, currentlySelectedRows);

    if (allSelected && !currentlySelectedRows.includes(record.id)) {
        currentlySelectedRows.push(record.id);
    }
};

// uncheck header if all children are not checked
const uncheckHeader = (record, currentlySelectedRows, expandedRows) => {
    let allSelected = areAllChildrenSelected(record, currentlySelectedRows);
    let isChecked = currentlySelectedRows.includes(record.id);
    let isExpanded = expandedRows.includes(record.id);

    if (!allSelected && isChecked && isExpanded) {
        remove(record.id, currentlySelectedRows);
    }
};

// HELPER FUNCTIONS
// -------------------------------------------------

const remove = (indexStr, currentlySelectedRows) => {
    const index = currentlySelectedRows.indexOf(indexStr);
    if (index > -1) {
        currentlySelectedRows.splice(index, 1);
    }
};

const areAllChildrenSelected = (record, currentlySelectedRows) => {
    var allSelected = true;

    record.children.forEach((child) => {
        if (!currentlySelectedRows.includes(child.id)) {
            allSelected = false;
        }
    });

    return allSelected;
};

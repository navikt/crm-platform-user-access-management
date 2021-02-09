public with sharing class AccessApplicationModel {
    @AuraEnabled
    public Id id;

    @AuraEnabled
    public Id parentId;
    @AuraEnabled
    public Boolean isParent;
    @AuraEnabled
    public Boolean isChild;

    @AuraEnabled
    public String name;
    @AuraEnabled
    public String description;
    @AuraEnabled
    public String applicationReason;
    @AuraEnabled
    public Boolean isApplied;
    @AuraEnabled
    public Boolean isAssigned;

    @AuraEnabled
    public List<AccessApplicationModel> children;

    public AccessApplicationModel(
        Id id,
        Id parentId,
        String name,
        String description,
        Boolean isApplied,
        Boolean isAssigned,
        List<AccessApplicationModel> permissions
    ) {
        this.id = id;
        this.parentId = parentId;

        if (parentId == null) {
            this.isParent = true;
            this.isChild = false;
        } else {
            this.isParent = false;
            this.isChild = true;
        }

        this.name = name;
        this.description = description;

        this.isApplied = isApplied;
        this.isAssigned = isAssigned;

        this.children = permissions;
    }

    // TODO add sorting
}

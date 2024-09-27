export { BaseCommand, CreateNodeCommand, UpdateNodeCommand, DeleteNodeCommand, ClearNodeCommand, UpdateNodeOrderCommand, UpdateSelectAliasCommand, UpdateSourceAliasCommand, UpdateNodeOrderDirectionCommand }

class BaseCommand {

    Id;
    ParentId;
    NodeType;
    Role;
    DataPrototype;
    Value;

    constructor(id, parentId, nodeType, role, dataPrototype, value) {

        this.Id = id;
        this.ParentId = parentId;
        this.NodeType = nodeType;
        this.Role = role;
        this.DataPrototype = dataPrototype;
        this.Value = value;
    }
}

class CreateNodeCommand extends BaseCommand {
    ColumnId;
    SourceId;

    constructor(id, parentId, nodeType, role, dataPrototype, value, sourceId, columnId) {
        super(id, parentId, nodeType, role, dataPrototype, value);

        this.ColumnId = columnId;
        this.SourceId = sourceId;
    }

    getUrl() {
        return '/expression-node/create/';
    }
}

class UpdateNodeCommand extends BaseCommand {

    Alias;

    constructor(id, parentId, nodeType, role, dataPrototype, value, alias) {
        super(id, parentId, nodeType, role, dataPrototype, value);
        this.Alias = alias;
    }

    getUrl() {
        return '/expression-node/update/';
    }
}

class UpdateNodeOrderCommand extends BaseCommand {
    constructor(id, parentId, nodeType, role, dataPrototype, value) {
        super(id, parentId, nodeType, role, dataPrototype, value);
    }

    getUrl() {
        return '/expression-node/update-order/';
    }
}

class UpdateSelectAliasCommand extends BaseCommand {
    constructor(id, parentId, nodeType, role, dataPrototype, value) {
        super(id, parentId, nodeType, role, dataPrototype, value);
    }

    getUrl() {
        return '/expression-node/update/select-alias/';
    }
}

class UpdateSourceAliasCommand extends BaseCommand {
    constructor(id, parentId, nodeType, role, dataPrototype, value) {
        super(id, parentId, nodeType, role, dataPrototype, value);
    }

    getUrl() {
        return '/expression-node/update/source-alias/';
    }
}

class DeleteNodeCommand extends BaseCommand {
    constructor(id, parentId, nodeType, role, dataPrototype, value) {
        super(id, parentId, nodeType, role, dataPrototype, value);
    }

    getUrl() {
        return '/expression-node/delete/';
    }
}

class ClearNodeCommand extends BaseCommand {
    constructor(id, parentId, nodeType, role, dataPrototype, value) {
        super(id, parentId, nodeType, role, dataPrototype, value);
    }

    getUrl() {
        return '/expression-node/clear/';
    }
}

class UpdateNodeOrderDirectionCommand extends BaseCommand {
    constructor(id, parentId, nodeType, role, dataPrototype, value) {
        super(id, parentId, nodeType, role, dataPrototype, value);
    }

    getUrl() {
        return '/expression-node/update/order/direction/';
    }
}

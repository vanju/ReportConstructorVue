import { BaseCommand, CreateNodeCommand, UpdateNodeCommand, DeleteNodeCommand, ClearNodeCommand, UpdateNodeOrderCommand, UpdateSelectAliasCommand, UpdateSourceAliasCommand, UpdateNodeOrderDirectionCommand } from './command.js';

export default {
    build: function (node, menuCommand) {

        let command = null;
        switch (menuCommand.ActionHint) {
            case 'create':
                command = this.buildCreateCommand(node, menuCommand);
                break;
            case 'update':
                command = this.buildUpdateCommand(node, menuCommand);
                break;
            case 'create/update':

                break;
            case 'order':
                command = this.buildUpdateNodeOrderCommand(node, menuCommand);
                break;
            case 'delete':
                command = this.buildDeleteCommand(node, menuCommand);
                break;
        }

        return command;
    },

    buildUpdateSelectAliasCommand(node) {
        return new UpdateSelectAliasCommand(
            node.Id,
            node.ParentId,
            node.NodeType,
            node.Role ?? '',
            node.DataPrototype,
            node.Alias,
        );
    },

    buildUpdateSourceAliasCommand(node) {
        return new UpdateSourceAliasCommand(
            node.Id,
            node.ParentId,
            node.NodeType,
            node.Role ?? '',
            node.DataPrototype,
            node.Source.Alias,
        );
    },

    buildUpdateConstantCommand: function (node) {

        return new UpdateNodeCommand(
            node.Id,
            node.ParentId,
            node.NodeType,
            node.Role ?? '',
            node.DataPrototype,
            node.Constant.Value.toString()
        );
    },

    buildUpdateCommand(node, menuCommand) {
        
        return new UpdateNodeCommand(
            node.Id,
            node.ParentId,
            menuCommand.NodeType,
            menuCommand.Role,
            menuCommand.DataPrototype,
            menuCommand.Value,
            null
        );
    },

    buildUpdateNodeOrderCommand(node, menuCommand) {

        return new UpdateNodeOrderCommand(
            node.Id,
            node.ParentId,
            node.NodeType,
            node.Role ?? '',
            null,
            menuCommand.Value
        );
    },

    buildCreateCommand(node, menuCommand) {

        return new CreateNodeCommand(
            node.Id,
            node.Id,
            menuCommand.NodeType,
            menuCommand.Role,
            menuCommand.DataPrototype != null ? menuCommand.DataPrototype : null,
            menuCommand.Value,
            menuCommand.SourceId != null ? menuCommand.SourceId : 0,
            menuCommand.ColumnId != null ? menuCommand.ColumnId : 0
        );
    },

    buildCreateWrapperCommand(node) {

        return new CreateNodeCommand(
            node.ParentId,
            node.ParentId,
            node.NodeType,
            node.Role,
            null,
            node.Origin.Id.toString()
        );
    },

    buildUpdateOrderDirectionCommand(node) {

        return new UpdateNodeOrderDirectionCommand(
            node.Id,
            node.ParentId,
            node.NodeType,
            node.Role,
            null,
            node.Dir == 1 ? 'desc' : 'asc'
        );
    },

    buildDeleteCommand(node) {

        return new DeleteNodeCommand(
            node.Id,
            node.ParentId,
            node.NodeType,
            node.Role ?? '',
            null,
            ''
        );
    },

    buildClearCommand(node) {
        return new ClearNodeCommand(
            node.Id,
            node.ParentId,
            node.NodeType,
            node.Role ?? '',
            null,
            ''
        );
    }

}

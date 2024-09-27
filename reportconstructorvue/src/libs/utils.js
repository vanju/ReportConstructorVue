export default class Utils {
    static findNodeById(root, id) {

        if (root.Id == id) {
            return root;
        }

        let result = null;

        if (root.NodeType == 'container') {

            for (let i = 0; i < root.Children.length; i++) {
                result = Utils.findNodeById(root.Children[i], id);
                if (result != null) break;
            }
        }
        return result;
    }

    static findSourceNodeById(root, id) {

        if (root.SourceId == id) {
            return root;
        }

        let result = null;

        if (root.NodeType == 'container') {

            for (let i = 0; i < root.Children.length; i++) {
                result = Utils.findSourceNodeById(root.Children[i], id);
                if (result != null) break;
            }
        }
        return result;
    }

    static findParent(tree, path) {
        return Utils.findNodeByPath(tree, Utils.getSubPath(path, -1));
    }

    static findNodeByPath(tree, path) {
        
        let ids = path.split('/');

        if (ids.length == 0) {
            return null;
        } else if (ids.length == 1 && ids[0] == tree.Id) {
            return tree;
        }

        let id = ids.shift();

        return tree.Id == id ? Utils.findNodeByPathInner(tree, ids) : null;
    }

    static findNodeByPathInner(root, ids) {
        
        let id = ids.shift();
        let result = null;

        if (root.NodeType == 'container') {

            for (let i = 0; i < root.Children.length; i++) {

                if (root.Children[i].Id == id) {
                    if (ids.length == 0) {
                        return root.Children[i];
                    } else {
                        return Utils.findNodeByPathInner(root.Children[i], ids);
                    }
                }
            }
        }
        return result;
    }

    static getSubPath(path, level) {

        if (level == 0 || path == '' || path == '/') {
            return '';
        }

        let ids = path.split('/');

        ids.splice(level);

        return ids.join('/');
    }
}

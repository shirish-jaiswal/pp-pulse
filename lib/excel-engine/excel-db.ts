import { access } from "fs";

export const RESOLUTION_TEMPLATE_CONFIG = {
  name: "resolution_template",
  tables: {
    resolutions: {
      name: "resolutions",
      schema: ["id", "title", "game", "category", "subcategory", "content", "created_at", "updated_at"]
    },
    variables: {
      name: "variables",
      schema: ["id", "key", "value", "created_at", "updated_at"]
    },
    games: {
        name: "games",
        schema: ["id", "title", "created_at", "updated_at"]
    },
    categories: {
        name: "categories",
        schema: ["id", "title", "created_at", "updated_at"]
    },
    subcategories: {
        name: "sub_category",
        schema: ["id", "title", "game", "created_at", "updated_at"]
    }
  }
};

export const RBAC_CONFIG = {
  name: "rbac",
  tables: {
    feature_list: {
      name: "feature_list",
      schema: ["id", "title", "icon", "path", "roles", "created_at", "updated_at"]
    },
    roles: {
      name: "roles",
      schema: ["id", "title", "created_at", "updated_at"]
    },
    access_control: {
        name: "access_control",
        schema: ["id", "role", "feature_list", "created_at", "updated_at"]
    },
    exception: {
        name: "exception",
        schema: ["id", "email", "feature_list", "created_at", "updated_at"]
    },
  }
};


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
    subcategories: {
        name: "sub_category",
        schema: ["id", "title", "game", "created_at", "updated_at"]
    }
  }
};
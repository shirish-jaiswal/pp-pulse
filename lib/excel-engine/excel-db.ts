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
    profile: {
      name: "profile",
      schema: ["id", "name", "email", "role", "settings", "created_at", "updated_at"]
    }
  }
};

export const KNOWLEDGE_BASE_CONFIG = {
  name: "knowledge_base",
  tables: {
    qna: {
      name: "qna",
      schema: ["id", "question", "answer", "options", "created_at", "updated_at"]
    },
    helpNotes: {
      name: "help_notes",
      schema: ["id", "notes", "priority", "created_at", "updated_at"]
    },
  }
};

export const GAMES_CONFIG = {
  name: "games",
  tables: {
    baccarat: {
      name: "baccarat_cards",
      schema: ["id", "code", "suit", "rank", "name", "created_at", "updated_at"]
    },
  }
};

export const KIBANA_DB_CONFIG = {
  name: "kibana",
  tables: {
    data_views: {
      name: "data_views",
      schema: ["id", "uuid", "name", "created_at", "updated_at"]
    },
    search_auto_compelete: {
      name: "search_auto_compelete",
      schema: ["id", "name", "created_at", "updated_at"]
    },
    queries: {
      name: "queries",
      schema: ["id", "game", "filters", "query", "created_at", "updated_at"]
    },
  }
}

export const POTENTIAL_WIN_CONFIG = {
  name: "potential_winnings",
  tables: {
    roulette: {
      name: "roulette",
      schema: ["id", "description", "bet_codes", "short_desc", "payout", "created_at", "updated_at"]
    },
  }
};
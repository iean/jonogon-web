/**
 * Interface that represents application configuration for an environment
 */
export interface IApplicationConfiguration {
  /** api settings for the environment */
  apiConfig: IApiConfiguration;
  rootUrl: string;
  languageConfig: LanguageConfiguration;
  product_id: string;
  affiliate_product_id: string;
  zohodesk_org_id: string;
  industry_field_name: string;
  signup_plan_code: string;
  signup_plan_url: string;
  plan_codes: plan_codes;
  contact_sales_URL: string;
  version: string;
}

/**
 * api connectivity configuration
 */
export interface IApiConfiguration {
  baseUrl: string;
  servicesUrl: string;
}

export interface LanguageConfiguration {
  activated_languages: Language[];
  default_language: string;
}

export interface Language {
  key: string;
  language_key: string;
}

export interface plan_codes {
  eino_free: string;
  eino_free_yearly: string;
}

export interface AutoLogoutSettings {
  auto_logout: boolean;
  auto_logout_duration: number;
}

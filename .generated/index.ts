type BuildTuple<T, N extends number, R extends T[] = []> = R["length"] extends N
  ? R
  : BuildTuple<T, N, [...R, T]>;

type TuplePrefixes<T extends any[]> = T extends [any, ...infer Rest]
  ? T | TuplePrefixes<Rest extends any[] ? Rest : []>
  : [];

type MaxTuple<T, N extends number> = TuplePrefixes<BuildTuple<T, N>>;

export interface IPublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface IFile {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: object;
  description?: string;
  dimension?: {
    height: number;
    width: number;
  };
  publish_details: IPublishDetails;
}

export interface ILink {
  title: string;
  href: string;
}

export interface ITaxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
}

export type ITaxonomyEntry = ITaxonomy & { term_uid: string };

export interface CSLPAttribute {
  "data-cslp"?: string;
  "data-cslp-parent-field"?: string;
}
export type CSLPFieldMapping = CSLPAttribute | string;

export interface ISystemFields {
  uid?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  _content_type_uid?: string;
  tags?: string[];
  ACL?: any[];
  _version?: number;
  _in_progress?: boolean;
  locale?: string;
  publish_details?: IPublishDetails;
  title?: string;
}

export type IModularBlocksExtension<T> = {
  [P in keyof T]?: T[P] & { _metadata?: { uid?: string } };
};

export interface INavigationLink {
  _version?: number;
  page_reference?: IPage[];
  link?: ILink;
  open_in_new_window: boolean;
  $?: {
    page_reference?: CSLPFieldMapping;
    link?: CSLPFieldMapping;
    open_in_new_window?: CSLPFieldMapping;
  };
}

export interface IEnhancedCta {
  _version?: number;
  link?: ILink;
  opens_in_new_tab: boolean;
  has_font_awesome_icons: boolean;
  left_font_awesome_icon_class?: string;
  right_font_awesome_icon_class?: string;
  cta_variant:
    | "primary"
    | "primary-outline"
    | "supporting"
    | "supporting-outline"
    | "light-blue"
    | "orange"
    | "green"
    | "yellow";
  cta_size: "fixed" | "variable";
  adobe_datalayer_fields?: {
    click_type?: string;
    click_location?: string;
    click_name?: string;
    $?: {
      click_type?: CSLPFieldMapping;
      click_location?: CSLPFieldMapping;
      click_name?: CSLPFieldMapping;
    };
  };
  modal_cta: boolean;
  modal_content?: {
    title?: string;
    content?: string;
    $?: {
      title?: CSLPFieldMapping;
      content?: CSLPFieldMapping;
    };
  };
  $?: {
    link?: CSLPFieldMapping;
    opens_in_new_tab?: CSLPFieldMapping;
    has_font_awesome_icons?: CSLPFieldMapping;
    left_font_awesome_icon_class?: CSLPFieldMapping;
    right_font_awesome_icon_class?: CSLPFieldMapping;
    cta_variant?: CSLPFieldMapping;
    cta_size?: CSLPFieldMapping;
    adobe_datalayer_fields?: CSLPFieldMapping;
    modal_cta?: CSLPFieldMapping;
    modal_content?: CSLPFieldMapping;
  };
}

export interface ISocialLink {
  _version?: number;
  social_link?: ILink;
  social_icon?: IFile | null;
  social_icon_alt_text?: string;
  $?: {
    social_link?: CSLPFieldMapping;
    social_icon?: CSLPFieldMapping;
    social_icon_alt_text?: CSLPFieldMapping;
  };
}

export interface INavigationLink {
  _version?: number;
  link?: ILink;
  open_in_new_window: boolean;
  $?: {
    link?: CSLPFieldMapping;
    open_in_new_window?: CSLPFieldMapping;
  };
}

export interface IAccordionModularBlock {
  _version?: number;
  expand_label?: string;
  collapse_label?: string;
  enable_expand_all: boolean;
  reference: IAccordionItem[];
  $?: {
    expand_label?: CSLPFieldMapping;
    collapse_label?: CSLPFieldMapping;
    enable_expand_all?: CSLPFieldMapping;
    reference?: CSLPFieldMapping;
  };
}

export interface IEnhancedImage {
  _version?: number;
  image?: IFile | null;
  alternate_text?: string;
  responsive_image: boolean;
  dimensions?: {
    image_width?: number | null;
    image_height?: number | null;
    $?: {
      image_width?: CSLPFieldMapping;
      image_height?: CSLPFieldMapping;
    };
  };
  image_fit_options?: ("cover" | "contain") | null;
  image_position_options?:
    | (
        | "center"
        | "center left"
        | "center right"
        | "top"
        | "top left"
        | "top right"
        | "bottom"
        | "bottom left"
        | "bottom right"
      )
    | null;
  rounded_image: boolean;
  $?: {
    image?: CSLPFieldMapping;
    alternate_text?: CSLPFieldMapping;
    responsive_image?: CSLPFieldMapping;
    dimensions?: CSLPFieldMapping;
    image_fit_options?: CSLPFieldMapping;
    image_position_options?: CSLPFieldMapping;
    rounded_image?: CSLPFieldMapping;
  };
}

export interface ISitemapSetting {
  _version?: number;
  change_frequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number | null;
  $?: {
    change_frequency?: CSLPFieldMapping;
    priority?: CSLPFieldMapping;
  };
}

export interface IHeroBannerModularBlock {
  _version?: number;
  component_variant: "Default" | "Left Aligned Split";
  banner_heading?: string;
  banner_description?: string;
  banner_image?: IEnhancedImage;
  banner_cta?: IEnhancedCta[];
  $?: {
    component_variant?: CSLPFieldMapping;
    banner_heading?: CSLPFieldMapping;
    banner_description?: CSLPFieldMapping;
    banner_image?: CSLPFieldMapping;
    banner_cta?: CSLPFieldMapping;
  };
}

export interface ISeo {
  _version?: number;
  title?: string;
  description?: string;
  keywords?: string;
  robots?: {
    index: boolean;
    follow: boolean;
    max_image_preview?: ("none" | "standard" | "large") | null;
    $?: {
      index?: CSLPFieldMapping;
      follow?: CSLPFieldMapping;
      max_image_preview?: CSLPFieldMapping;
    };
  };
  opengraph?: {
    type?:
      | (
          | "website"
          | "article"
          | "book"
          | "profile"
          | "music.song"
          | "music.album"
          | "music.playlist"
          | "music.radio_station"
          | "video.movie"
          | "video.episode"
          | "video.tv_show"
          | "video.other"
        )
      | null;
    title?: string;
    description?: string;
    site_name?: string;
    image?: IFile | null;
    $?: {
      type?: CSLPFieldMapping;
      title?: CSLPFieldMapping;
      description?: CSLPFieldMapping;
      site_name?: CSLPFieldMapping;
      image?: CSLPFieldMapping;
    };
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: IFile | null;
    site?: string;
    card_type?: ("summary" | "summary_large_image" | "player" | "app") | null;
    $?: {
      title?: CSLPFieldMapping;
      description?: CSLPFieldMapping;
      image?: CSLPFieldMapping;
      site?: CSLPFieldMapping;
      card_type?: CSLPFieldMapping;
    };
  };
  custom_meta_tags?: {
    name?: string;
    content?: string;
    $?: {
      name?: CSLPFieldMapping;
      content?: CSLPFieldMapping;
    };
  }[];
  $?: {
    title?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    keywords?: CSLPFieldMapping;
    robots?: CSLPFieldMapping;
    opengraph?: CSLPFieldMapping;
    twitter?: CSLPFieldMapping;
    custom_meta_tags?: CSLPFieldMapping;
  };
}

export interface IAccordionItem extends ISystemFields {
  _version?: number;
  title: string;
  accordion_title: string;
  description: string;
  taxonomies?: ITaxonomy | ITaxonomyEntry[];
  $?: {
    title?: CSLPFieldMapping;
    accordion_title?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface IComponents extends ISystemFields {
  hero_banner: IHeroBannerModularBlock;
  accordion: IAccordionModularBlock;
  cta_button: IEnhancedCta;
}

export interface IPage extends ISystemFields {
  _version?: number;
  title: string;
  url: string;
  components?: IModularBlocksExtension<IComponents>[];
  seo?: ISeo;
  sitemap_setting?: ISitemapSetting;
  taxonomies?: ITaxonomy | ITaxonomyEntry[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    components?: CSLPFieldMapping;
    seo?: CSLPFieldMapping;
    sitemap_setting?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface IDictionaryItems extends ISystemFields {
  _version?: number;
  title: string;
  back_to_top_label?: string;
  language_selector_label?: string;
  is_selected_label?: string;
  $?: {
    title?: CSLPFieldMapping;
    back_to_top_label?: CSLPFieldMapping;
    language_selector_label?: CSLPFieldMapping;
    is_selected_label?: CSLPFieldMapping;
  };
}

export interface IHeader extends ISystemFields {
  _version?: number;
  title: string;
  logo?: IEnhancedImage;
  logo_link?: ILink;
  main_navigation?: {
    navigation_title?: string;
    main_navigation_links?: IEnhancedCta[];
    sub_navigation?: {
      sub_navigation_title?: string;
      global_field?: IEnhancedCta[];
      final_navigation?: {
        title?: string;
        global_field?: IEnhancedCta[];
        $?: {
          title?: CSLPFieldMapping;
          global_field?: CSLPFieldMapping;
        };
      }[];
      $?: {
        sub_navigation_title?: CSLPFieldMapping;
        global_field?: CSLPFieldMapping;
        final_navigation?: CSLPFieldMapping;
      };
    }[];
    $?: {
      navigation_title?: CSLPFieldMapping;
      main_navigation_links?: CSLPFieldMapping;
      sub_navigation?: CSLPFieldMapping;
    };
  }[];
  taxonomies?: ITaxonomy | ITaxonomyEntry[];
  $?: {
    title?: CSLPFieldMapping;
    logo?: CSLPFieldMapping;
    logo_link?: CSLPFieldMapping;
    main_navigation?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface IFooter extends ISystemFields {
  _version?: number;
  title: string;
  footer_section?: MaxTuple<
    {
      section_heading?: string;
      navigation_link?: INavigationLink[];
      $?: {
        section_heading?: CSLPFieldMapping;
        navigation_link?: CSLPFieldMapping;
      };
    },
    2
  >;
  social_connect_section?: {
    section_heading?: string;
    social_links?: ISocialLink[];
    policy_and_terms?: string;
    copyright_details?: string;
    $?: {
      section_heading?: CSLPFieldMapping;
      social_links?: CSLPFieldMapping;
      policy_and_terms?: CSLPFieldMapping;
      copyright_details?: CSLPFieldMapping;
    };
  };
  taxonomies?: ITaxonomy | ITaxonomyEntry[];
  $?: {
    title?: CSLPFieldMapping;
    footer_section?: CSLPFieldMapping;
    social_connect_section?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface ISiteSettings extends ISystemFields {
  _version?: number;
  title: string;
  favicons?: {
    icon?: IFile | null;
    apple_touch?: IFile | null;
    $?: {
      icon?: CSLPFieldMapping;
      apple_touch?: CSLPFieldMapping;
    };
  };
  robots_file_setting?: {
    user_agent?: string;
    allow?: string;
    disallow?: string;
    crawl_delay?: number | null;
    $?: {
      user_agent?: CSLPFieldMapping;
      allow?: CSLPFieldMapping;
      disallow?: CSLPFieldMapping;
      crawl_delay?: CSLPFieldMapping;
    };
  }[];
  content_security_policy_configuration?: {
    script_src?: string;
    script_src_elem?: string;
    style_src?: string;
    img_src?: string;
    connect_src?: string;
    frame_src?: string;
    media_src?: string;
    fontsource?: string;
    $?: {
      script_src?: CSLPFieldMapping;
      script_src_elem?: CSLPFieldMapping;
      style_src?: CSLPFieldMapping;
      img_src?: CSLPFieldMapping;
      connect_src?: CSLPFieldMapping;
      frame_src?: CSLPFieldMapping;
      media_src?: CSLPFieldMapping;
      fontsource?: CSLPFieldMapping;
    };
  };
  taxonomies?: ITaxonomy | ITaxonomyEntry[];
  $?: {
    title?: CSLPFieldMapping;
    favicons?: CSLPFieldMapping;
    robots_file_setting?: CSLPFieldMapping;
    content_security_policy_configuration?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface IRedirectMappings extends ISystemFields {
  _version?: number;
  title: string;
  mappings?: {
    source: string;
    destination: string;
    status?: ("Active" | "Disabled") | null;
    $?: {
      source?: CSLPFieldMapping;
      destination?: CSLPFieldMapping;
      status?: CSLPFieldMapping;
    };
  }[];
  $?: {
    title?: CSLPFieldMapping;
    mappings?: CSLPFieldMapping;
  };
}

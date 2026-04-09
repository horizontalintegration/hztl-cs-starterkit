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

export interface IImageVideoCarousel {
  _version?: number;
  carousel_type?: ("Image" | "Video") | null;
  carousel_items?: {
    carousel_image?: IFile | null;
    image_alt?: string;
    video_id?: string;
    title?: string;
    description?: string;
    cta?: IEnhancedCta;
    $?: {
      carousel_image?: CSLPFieldMapping;
      image_alt?: CSLPFieldMapping;
      video_id?: CSLPFieldMapping;
      title?: CSLPFieldMapping;
      description?: CSLPFieldMapping;
      cta?: CSLPFieldMapping;
    };
  }[];
  carousel_full_width: boolean;
  $?: {
    carousel_type?: CSLPFieldMapping;
    carousel_items?: CSLPFieldMapping;
    carousel_full_width?: CSLPFieldMapping;
  };
}

export interface ICtaButtonModularBlock {
  _version?: number;
  cta?: IEnhancedCta;
  $?: {
    cta?: CSLPFieldMapping;
  };
}

export interface IEnhancedCta {
  _version?: number;
  link?: ILink;
  page_reference?: IPage[];
  opens_in_new_tab: boolean;
  has_font_awesome_icons: boolean;
  left_font_awesome_icon_class?: string;
  right_font_awesome_icon_class?: string;
  cta_variant?:
    | (
        | "primary"
        | "primary-outline"
        | "supporting"
        | "supporting-outline"
        | "light-blue"
        | "orange"
        | "green"
        | "yellow"
      )
    | null;
  cta_size?: ("fixed" | "variable") | null;
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
    page_reference?: CSLPFieldMapping;
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

export interface INavigationLink {
  _version?: number;
  page_reference?: IPage[];
  link?: ILink;
  open_in_new_window: boolean;
  english_only_link: boolean;
  $?: {
    page_reference?: CSLPFieldMapping;
    link?: CSLPFieldMapping;
    open_in_new_window?: CSLPFieldMapping;
    english_only_link?: CSLPFieldMapping;
  };
}

export interface IRteModularBlock {
  _version?: number;
  rte?: string;
  $?: {
    rte?: CSLPFieldMapping;
  };
}

export interface ITabbedContentModularBlock {
  _version?: number;
  tab_variant?: ("Horizontal" | "Vertical") | null;
  tab_content_iteam?: {
    tab_title?: string;
    tab_icon?: IFile | null;
    tab_content_type?: ("RTE" | "Image") | null;
    rte?: string;
    image_data?: {
      image?: IFile | null;
      image_caption?: string;
      $?: {
        image?: CSLPFieldMapping;
        image_caption?: CSLPFieldMapping;
      };
    };
    $?: {
      tab_title?: CSLPFieldMapping;
      tab_icon?: CSLPFieldMapping;
      tab_content_type?: CSLPFieldMapping;
      rte?: CSLPFieldMapping;
      image_data?: CSLPFieldMapping;
    };
  }[];
  $?: {
    tab_variant?: CSLPFieldMapping;
    tab_content_iteam?: CSLPFieldMapping;
  };
}

export interface IMediaFullWidth {
  _version?: number;
  image?: IFile | null;
  image_alt?: string;
  show_video: boolean;
  video_id?: string;
  $?: {
    image?: CSLPFieldMapping;
    image_alt?: CSLPFieldMapping;
    show_video?: CSLPFieldMapping;
    video_id?: CSLPFieldMapping;
  };
}

export interface IIframe {
  _version?: number;
  url?: string;
  title?: string;
  width?: number | null;
  height?: number | null;
  $?: {
    url?: CSLPFieldMapping;
    title?: CSLPFieldMapping;
    width?: CSLPFieldMapping;
    height?: CSLPFieldMapping;
  };
}

export interface IQuote {
  _version?: number;
  quote_content?: string;
  author_name?: string;
  author_info?: string;
  text_color?: IColorList;
  background_color?: IColorList;
  border_color?: IColorList;
  $?: {
    quote_content?: CSLPFieldMapping;
    author_name?: CSLPFieldMapping;
    author_info?: CSLPFieldMapping;
    text_color?: CSLPFieldMapping;
    background_color?: CSLPFieldMapping;
    border_color?: CSLPFieldMapping;
  };
}

export interface ICtaBar {
  _version?: number;
  title?: string;
  description?: string;
  cta?: IEnhancedCta;
  $?: {
    title?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    cta?: CSLPFieldMapping;
  };
}

export interface IEnhancedImage {
  _version?: number;
  image?: IFile | null;
  alternate_text?: string;
  custom_dimensions?: {
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
    custom_dimensions?: CSLPFieldMapping;
    image_fit_options?: CSLPFieldMapping;
    image_position_options?: CSLPFieldMapping;
    rounded_image?: CSLPFieldMapping;
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

export interface IColorList {
  _version?: number;
  color_list?: ("#125590" | "#007DB3") | null;
  $?: {
    color_list?: CSLPFieldMapping;
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
  accordion: IAccordionModularBlock;
  cta_button: ICtaButtonModularBlock;
  quote: IQuote;
  cta_bar: ICtaBar;
  iframe: IIframe;
  rte: IRteModularBlock;
  tabbed_content: ITabbedContentModularBlock;
  media_full_width: IMediaFullWidth;
  image_video_carousel: IImageVideoCarousel;
}

export interface IPage extends ISystemFields {
  _version?: number;
  title: string;
  url: string;
  hero_banner?: {
    banner_media?: {
      banner_type: "imageBanner" | "videoBanner";
      banner_image?: IFile | null;
      image_alt_text?: string;
      video_id?: string;
      $?: {
        banner_type?: CSLPFieldMapping;
        banner_image?: CSLPFieldMapping;
        image_alt_text?: CSLPFieldMapping;
        video_id?: CSLPFieldMapping;
      };
    };
    banner_title?: string;
    banner_description?: string;
    banner_cta?: IEnhancedCta;
    banner_content_alignment?: ("left" | "center" | "right") | null;
    $?: {
      banner_media?: CSLPFieldMapping;
      banner_title?: CSLPFieldMapping;
      banner_description?: CSLPFieldMapping;
      banner_cta?: CSLPFieldMapping;
      banner_content_alignment?: CSLPFieldMapping;
    };
  };
  components?: IModularBlocksExtension<IComponents>[];
  seo?: ISeo;
  sitemap_setting?: ISitemapSetting;
  taxonomies?: ITaxonomy | ITaxonomyEntry[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    hero_banner?: CSLPFieldMapping;
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
  external_link_identifier_icon?: IFile | null;
  external_link_identifier_label?: string;
  english_only_identifier_icon?: IFile | null;
  english_only_identifier_label?: string;
  hamburger_menu_icon?: IFile | null;
  menu_label?: string;
  taxonomies?: ITaxonomy | ITaxonomyEntry[];
  $?: {
    title?: CSLPFieldMapping;
    back_to_top_label?: CSLPFieldMapping;
    language_selector_label?: CSLPFieldMapping;
    is_selected_label?: CSLPFieldMapping;
    external_link_identifier_icon?: CSLPFieldMapping;
    external_link_identifier_label?: CSLPFieldMapping;
    english_only_identifier_icon?: CSLPFieldMapping;
    english_only_identifier_label?: CSLPFieldMapping;
    hamburger_menu_icon?: CSLPFieldMapping;
    menu_label?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface IHeader extends ISystemFields {
  _version?: number;
  title: string;
  desktop_logo?: IEnhancedImage;
  mobile_logo?: IEnhancedImage;
  logo_link?: ILink;
  search_box_placeholder?: string;
  nav_level_one?: {
    nav_level_one_title?: string;
    show_account_login_section: boolean;
    my_account_login?: {
      login_form_label?: string;
      login_form_action_url?: string;
      username_field_placeholder?: string;
      password_field_placeholder?: string;
      login_button_label?: string;
      forgot_password_link?: ILink;
      signup_content?: string;
      disclaimer_note?: string;
      $?: {
        login_form_label?: CSLPFieldMapping;
        login_form_action_url?: CSLPFieldMapping;
        username_field_placeholder?: CSLPFieldMapping;
        password_field_placeholder?: CSLPFieldMapping;
        login_button_label?: CSLPFieldMapping;
        forgot_password_link?: CSLPFieldMapping;
        signup_content?: CSLPFieldMapping;
        disclaimer_note?: CSLPFieldMapping;
      };
    };
    featured_section?: {
      featured_content?: string;
      featured_link?: IEnhancedCta;
      featured_image?: IEnhancedImage;
      $?: {
        featured_content?: CSLPFieldMapping;
        featured_link?: CSLPFieldMapping;
        featured_image?: CSLPFieldMapping;
      };
    };
    nav_columns?: MaxTuple<
      {
        nav_level_one_links?: INavigationLink[];
        nav_level_two?: {
          nav_level_two_title?: string;
          nav_level_two_links?: INavigationLink[];
          nav_level_three?: {
            nav_level_three_title?: string;
            nav_level_three_links?: INavigationLink[];
            $?: {
              nav_level_three_title?: CSLPFieldMapping;
              nav_level_three_links?: CSLPFieldMapping;
            };
          }[];
          $?: {
            nav_level_two_title?: CSLPFieldMapping;
            nav_level_two_links?: CSLPFieldMapping;
            nav_level_three?: CSLPFieldMapping;
          };
        }[];
        $?: {
          nav_level_one_links?: CSLPFieldMapping;
          nav_level_two?: CSLPFieldMapping;
        };
      },
      2
    >;
    $?: {
      nav_level_one_title?: CSLPFieldMapping;
      show_account_login_section?: CSLPFieldMapping;
      my_account_login?: CSLPFieldMapping;
      featured_section?: CSLPFieldMapping;
      nav_columns?: CSLPFieldMapping;
    };
  }[];
  taxonomies?: ITaxonomy | ITaxonomyEntry[];
  $?: {
    title?: CSLPFieldMapping;
    desktop_logo?: CSLPFieldMapping;
    mobile_logo?: CSLPFieldMapping;
    logo_link?: CSLPFieldMapping;
    search_box_placeholder?: CSLPFieldMapping;
    nav_level_one?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface IFooter extends ISystemFields {
  _version?: number;
  title: string;
  footer_section?: MaxTuple<
    {
      section_heading?: string;
      navigation_links?: INavigationLink[];
      $?: {
        section_heading?: CSLPFieldMapping;
        navigation_links?: CSLPFieldMapping;
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

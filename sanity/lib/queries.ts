import { groq } from "next-sanity";

const imageProjection = `
  alt,
  crop,
  hotspot,
  asset->{
    _id,
    url,
    metadata {
      dimensions {
        width,
        height
      }
    }
  }
`;

const seoProjection = `
  seo{
    title,
    description,
    openGraphImage {
      ${imageProjection}
    }
  }
`;

const mediaProjection = `
  mediaType,
  image { ${imageProjection} },
  poster { ${imageProjection} },
  video { asset->{ _id, url } }
`;

const visibleProject = `_type == "project" && hidden != true && defined(slug.current)`;

export const HOMEPAGE_QUERY = groq`*[_type == "homepage" && _id == "homepage"][0]{
  features[project->hidden != true]{
    _key,
    layout,
    "title": project->title,
    "slug": project->slug.current,
    media { ${mediaProjection} },
    secondMedia { ${mediaProjection} },
    mobileMedia { ${mediaProjection} }
  },
  ${seoProjection}
}`;

export const PROJECT_INDEX_QUERY = groq`{
  "page": *[_type == "projectIndex" && _id == "projectIndex"][0]{
    "projects": projects[@->hidden != true && defined(@->slug.current)]->{
      _id,
      title,
      "slug": slug.current,
      discipline,
      "categories": categories[]->slug.current,
      thumbnail { ${imageProjection} },
      "fallbackImage": coalesce(
        slides[_type == "slideMedia" && media.mediaType == "image"][0].media.image,
        slides[_type == "slideMedia"][0].media.poster
      ){ ${imageProjection} }
    },
    ${seoProjection}
  },
  "categories": *[_type == "category" && defined(slug.current)] | order(order asc, title asc){
    title,
    "slug": slug.current
  }
}`;

export const PROJECT_QUERY = groq`*[${visibleProject} && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  headline,
  backgroundColor,
  textColor,
  slides[_type == "slideMedia"]{
    _key,
    media { ${mediaProjection} }
  },
  scope,
  credits[]{ _key, role, names },
  description,
  ${seoProjection}
}`;

export const PROJECT_SLUGS_QUERY = groq`*[${visibleProject}].slug.current`;

export const PROFILE_QUERY = groq`*[_type == "profile" && _id == "profile"][0]{
  sections[]{ _key, heading, body },
  columns[]{
    _key,
    details[]{ _key, heading, lines[]{ _key, label, href } }
  },
  ${seoProjection}
}`;

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  siteCreditLink,
  ${seoProjection}
}`;

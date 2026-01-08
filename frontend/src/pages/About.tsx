import { BrowserView, MobileView } from "react-device-detect";
import "./CSS/About.css";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import listOfMembers from "./data/aboutList.json";
import subchannels from "./data/subchannels.json";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const mediaIcons = [
    { icon: "/images/social_media_icons/youtube", link: "https://www.youtube.com/@EUMadeSimple/videos" },
    { icon: "/images/social_media_icons/instagram", link: "https://www.instagram.com/eu_made_simple/" },
    { icon: "/images/social_media_icons/discord", link: "https://discord.gg/eumadesimple" },
    { icon: "/images/social_media_icons/patreon", link: "https://www.patreon.com/eumadesimple" },
    { icon: "/images/social_media_icons/x", link: "https://x.com/EU_Made_Simple/" },
    { icon: "/images/social_media_icons/tiktok", link: "https://www.tiktok.com/@eumadesimple" },
    { icon: "/images/social_media_icons/linkedin", link: "https://www.linkedin.com/company/eumadesimple/" },
    { icon: "/images/social_media_icons/spotify", link: "https://open.spotify.com/show/0Nb6smcVnEtmRI2IkRqP56" }
  ];

  return <>
    <Helmet>
      <title>{t("about.pageTitle")}</title>
      <meta name="description" content={t("about.metaDescription")} />
    </Helmet>

    <BrowserView>
      <div className="about-container">
        <div className="quote-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt", marginBottom: "1em" }}>
            {t("about.welcomeTitle")}
          </h1>
          <p style={{ textAlign: "center", fontSize: "16pt" }}>
            {t("about.welcomeDescription")}
          </p>
          <br />
          <div className="media-icons-container">
            {mediaIcons.map(icon => (
              <a key={icon.link} href={icon.link} target="_blank" rel="noopener noreferrer" className="media-icon">
                <img
                  src={`${icon.icon}.svg`}
                  onMouseOver={(event) => {
                    const img = event.currentTarget as HTMLImageElement;
                    img.src = `${icon.icon}-shadow.svg`;
                  }}
                  onMouseOut={(event) => {
                    const img = event.currentTarget as HTMLImageElement;
                    img.src = `${icon.icon}.svg`;
                  }}
                />
              </a>
            ))}
          </div>
        </div>

        <hr style={{ width: "90%", margin: "3em auto" }} />

        <div className="team-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt" }}>{t("about.teamTitle")}</h1>
          <div className="team-members-container">
            {listOfMembers.map((person, index) => (<>
              <div key={index} className={`member-container ${((index + 1) % 2) === 0 ? 'align-right' : 'align-left'}`}>
                <div className="about-person-image">
                  <img style={{ width: "100%", height: "auto" }} src={person.image} alt={person.name} title={person.name} />
                </div>
                <div className="about-person-details-container">
                  <h3>{person.name}</h3>
                  <p style={{ fontSize: "14pt" }}>{t(person.role)}</p>
                  <br />
                  <div style={{
                    width: "70%",
                    marginLeft: `${(index + 1) % 2 === 0 ? 'auto' : '0'}`,
                    marginRight: `${(index + 1) % 2 === 0 ? '0' : 'auto'}`
                  }}>
                    {t(person.description).split("\n").map((line: string, index: number) => (
                      <><p key={index}>{line}</p><br /></>
                    ))}
                  </div>
                  <br />
                  <p style={{ color: "gray" }}>{t("about.emailLabel")} {person.email}</p>
                </div>
              </div>
              {index !== listOfMembers.length - 1 && <hr style={{ width: "40%", border: "1px solid #bdbdbd4e 26% / 0.537" }} />}
            </>))}
          </div>
        </div>

        <hr style={{ width: "82%", margin: "auto", marginBottom: "3em" }} />

        <div className="subchannel-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt" }}>{t("about.subchannelsTitle")}</h1>
          <br />
          <p style={{ textAlign: "center", fontSize: "16pt" }}>
            {t("about.subchannelsDescription")}
          </p>
          <br />
          <div className="subchannel-list">
            {subchannels.map((subchannel) => {
              const label = t(`about.subchannels.${subchannel.key}`);
              return (
                <Link key={subchannel.key} target="_blank" to={subchannel.link} className="subchannel-item">
                  <img
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    src={subchannel.logo}
                    alt={label}
                    className="subchannel-logo"
                  />
                  <h3>{label}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </BrowserView>

    <MobileView>
      <div className="mobile-about-container">
        <div className="quote-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt", marginBottom: "1em" }}>
            {t("about.welcomeTitle")}
          </h1>
          <p style={{ textAlign: "center", fontSize: "16pt" }}>
            {t("about.welcomeDescription")}
          </p>
        </div>

        <hr style={{ width: "80%", margin: "auto", marginBottom: "3em" }} />

        <div className="team-members-container">
          {listOfMembers.map((person, index) =>
            <div key={index} className="member-container">
              <div className="about-person-image">
                <img style={{ width: "100%", height: "auto" }} src={person.image} alt={person.name} />
              </div>
              <div className="about-person-details-container">
                <h3>{person.name}</h3>
                <p>{t(person.role)}</p>
                <br />
                <p>{t(person.description)}</p>
                <br />
                <p style={{ color: "gray" }}>{t("about.emailLabel")} {person.email}</p>
                <br />
              </div>
            </div>
          )}
        </div>

        <div className="subchannel-container">
          <h1 style={{ textAlign: "center", fontSize: "30pt" }}>{t("about.subchannelsTitle")}</h1>
          <br />
          <p style={{ textAlign: "center", fontSize: "16pt" }}>
            {t("about.subchannelsDescription")}
          </p>
          <br />
          <div className="subchannel-list">
            {subchannels.map((subchannel, index) => (
              <Link key={index} target="_blank" to={subchannel.link} className="subchannel-item">
                <img src={subchannel.logo} alt={t(`about.subchannels.${subchannel.key}`)} className="subchannel-logo" />
                <h3>{t(`about.subchannels.${subchannel.key}`)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MobileView>
  </>
};

export default About;

import { Link } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";
import { useTranslation } from "react-i18next";
import "./Footer.css";

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = [
    { text: t("footer.links.whoWeAre"), link: "about" },
    { text: t("footer.links.contactUs"), link: "contact" },
  ];

  const mediaIcons = [
    { icon: "/images/social_media_icons/youtube", link: "https://www.youtube.com/@EUMadeSimple/videos" },
    { icon: "/images/social_media_icons/instagram", link: "https://www.instagram.com/eu_made_simple/" },
    { icon: "/images/social_media_icons/discord", link: "https://discord.gg/jrzyVUjW" },
    { icon: "/images/social_media_icons/patreon", link: "https://www.patreon.com/eumadesimple" },
    { icon: "/images/social_media_icons/x", link: "https://x.com/EU_Made_Simple/" },
    { icon: "/images/social_media_icons/tiktok", link: "https://www.tiktok.com/@eumadesimple" },
    { icon: "/images/social_media_icons/linkedin", link: "https://www.linkedin.com/company/eumadesimple/" },
    { icon: "/images/social_media_icons/spotify", link: "https://open.spotify.com/show/0Nb6smcVnEtmRI2IkRqP56" }
  ];

  return (
    <>
      <BrowserView>
        <div className="footer">
          <div className="bottom-home-content">
            <div className="media-links-container">
              <p className="sub-title" style={{ color: "black" }}>
                {t("footer.joinCommunity.title")}
              </p>
              <p>
                {t("footer.joinCommunity.description")}
                <b>{t("footer.joinCommunity.makeDifference")}</b>.
              </p>
              <br />
              <div className="media-icons">
                {mediaIcons.map((icon) => (
                  <Link to={icon.link} target="_blank" className="media-icon" key={icon.icon}>
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
                  </Link>
                ))}
              </div>
            </div>
            <div className="support-container eums-box-shadow">
              <div style={{ display: "flex" }}>
                <p className="sub-title" style={{ color: "black" }}>
                  {t("footer.supportUs.title")}
                </p>
              </div>
              <div className="support-content">
                <p>
                  {t("footer.supportUs.description")}{" "}
                </p>
                <div className="bottom-content">
                  <div className="split-content" style={{ paddingRight: "2em" }}>
                    <p style={{ textAlign: "justify", marginRight: "1em" }}>
                      <b>{t("footer.supportUs.patreon.title")}</b>{" "}
                      {t("footer.supportUs.patreon.description")}
                    </p>
                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                      <Link to="https://www.patreon.com/eumadesimple" className="color-button">
                        {t("footer.supportUs.patreon.button")}
                      </Link>
                    </div>
                  </div>
                  <div style={{ paddingLeft: "2em" }} className="split-content">
                    <p style={{ textAlign: "justify" }}>
                      <b>{t("footer.supportUs.createContent.title")}</b>{" "}
                      {t("footer.supportUs.createContent.description")}
                    </p>
                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                      <button className="color-button">{t("footer.supportUs.createContent.button")}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-content">
            <h1 className="footer-title">{t("footer.title")}</h1>
            <div className="footer-link-container">
              {footerLinks.map((item) => (
                <Link className="menu-item" to={item.link} key={item.text}>
                  <span>{item.text}</span>
                </Link>
              ))}
            </div>
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </BrowserView>

      <MobileView>
        <div className="mobile-footer">
          <div className="mobile-footer-content">
            <h1 className="mobile-footer-title">{t("footer.title")}</h1>
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </MobileView>
    </>
  );
};

export default Footer;

export const editorialTeam = {
  name: "FitnessCalculatorPro Editorial Team",
  path: "/team/editorial",
  description:
    "The shared editorial byline for FitnessCalculatorPro.com guides about health and fitness calculators, the methods behind them, and the limits of their estimates.",
};

export function editorialTeamRef(siteUrl: string) {
  const url = new URL(editorialTeam.path, siteUrl).href;
  return {
    "@type": "Organization",
    "@id": url + "#organization",
    name: editorialTeam.name,
    url,
    description: editorialTeam.description,
    parentOrganization: { "@type": "Organization", "@id": siteUrl + "/#organization" },
  };
}

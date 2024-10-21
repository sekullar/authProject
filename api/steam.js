export default async function handler(req, res) {
    const { steamid } = req.query;
    const apiUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=DB773A873E356C67C98A46975F10B53A&steamids=${steamid}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Veri çekilemedi' });
    }
  }
  
async function getSteamID() {
  
  try {
      const response = await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=DB773A873E356C67C98A46975F10B53A&vanityurl=sekullarx`);
      const data = await response.json();
      
      console.log('API Yanıtı:', data); 

      if (data.response.success === 1) {
          return data.response.steamid;
      } else {
          console.error('Kullanıcı adı bulunamadı veya hata oluştu:', data.response);
          return null;
      }
  } catch (error) {
      console.error('API isteğinde bir hata oluştu:', error);
  }
}

// Kullanımı
getSteamID('sekullarx').then(steamID => {
  if (steamID) {
      console.log(`Steam ID: ${steamID}`);
  }
});

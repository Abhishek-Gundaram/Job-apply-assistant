chrome.commands.onCommand.addListener(async (command) => {
  if (command === "fill-basics") {
    const { profile } = await chrome.storage.local.get("profile");
    if (!profile) return;

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, {
      type: "FILL_BASICS",
      payload: profile
    });
  }
}); 

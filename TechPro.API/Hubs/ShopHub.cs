using Microsoft.AspNetCore.SignalR;

namespace TechPro.API.Hubs
{
    /// <summary>
    /// ShopHub: Real-time events for the storefront.
    /// - Flash sale countdown sync
    /// - Stock level updates
    /// - Admin order notifications
    /// </summary>
    public class ShopHub : Hub
    {
        // Client connects -> joins groups
        public async Task JoinFlashSaleRoom(int flashSaleId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"flashsale_{flashSaleId}");
        }

        public async Task LeaveFlashSaleRoom(int flashSaleId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"flashsale_{flashSaleId}");
        }

        public async Task JoinAdminRoom()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "admin");
        }

        // Server-side methods to push to clients:
        // hub.Clients.Group("admin").SendAsync("NewOrder", orderDto)
        // hub.Clients.Group($"flashsale_{id}").SendAsync("StockUpdated", remaining)
        // hub.Clients.All.SendAsync("FlashSaleStarted", flashSaleDto)
    }
}

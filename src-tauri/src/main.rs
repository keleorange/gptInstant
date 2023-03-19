// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, CustomMenuItem, ActivationPolicy};
use tauri_plugin_positioner::{Position, WindowExt};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");
    let system_tray_menu = SystemTrayMenu::new().add_item(quit);
    
    tauri::Builder::default()
        .setup(|app| {
            // hide dock icon
            app.set_activation_policy(ActivationPolicy::Accessory);
            Ok(())
        })
        .plugin(tauri_plugin_positioner::init())
        .system_tray(SystemTray::new().with_menu(system_tray_menu))
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);

            match event {
                SystemTrayEvent::LeftClick {
                    position: _,
                    size: _,
                    ..
                } => {
                    let window = app.get_window("main").unwrap();

                    let _ = window.move_window(Position::TrayCenter);
                    // toggle application window
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                },
                SystemTrayEvent::MenuItemClick { id, .. } =>  {
                    if id.as_str() == "quit" {
                        std::process::exit(0);
                    }
                },
                SystemTrayEvent::RightClick { tray_id: _, position: _, size: _ , ..} => {
                    print!("quit");
                },
                SystemTrayEvent::DoubleClick { tray_id: _, position: _, size: _, .. } => todo!(),
                _ => {}
            }
        })
        .on_window_event(|event| {
            if let tauri::WindowEvent::Focused(is_focused) = event.event() {
                // detect click outside of the focused window and hide the app
                if !is_focused {
                    event.window().hide().unwrap();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
